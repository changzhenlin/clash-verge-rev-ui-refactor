use crate::core::handle;
use crate::utils::tray_speed;
use crate::{Type, logging};
use parking_lot::Mutex;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::time::Duration;
use tauri::tray::TrayIcon;

/// 托盘网速采样间隔
const TRAY_SPEED_SAMPLE_INTERVAL: Duration = Duration::from_secs(1);

static TASK_ID_COUNTER: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);

/// macOS 托盘速率任务控制器。
#[derive(Clone)]
pub struct TraySpeedController {
    task_id: u64,
    running: Arc<AtomicBool>,
    thread_handle: Arc<Mutex<Option<thread::JoinHandle<()>>>>,
}

impl Default for TraySpeedController {
    fn default() -> Self {
        Self {
            task_id: TASK_ID_COUNTER.fetch_add(1, Ordering::Relaxed),
            running: Arc::new(AtomicBool::new(false)),
            thread_handle: Arc::new(Mutex::new(None)),
        }
    }
}

/// 重置速率显示缓存，强制下一次更新时重新渲染
pub fn reset_display_cache() {
    tray_speed::reset_last_display();
}

impl TraySpeedController {
    pub fn new() -> Self {
        Self::default()
    }

    /// 强制重新显示网速（图标更新后调用）
    pub fn force_redisplay(_tray: &TrayIcon) {
        tray_speed::reset_last_display();
        Self::apply_tray_speed(0, 0);
    }

    pub fn update_task(&self, enable_tray_speed: bool) {
        if enable_tray_speed {
            self.start_task();
        } else {
            self.stop_task();
        }
    }

    /// 启动托盘速率采集后台任务（基于系统网络接口监控）。
    fn start_task(&self) {
        logging!(
            info,
            Type::Tray,
            "[Task#{}] start_task() 被调用，running={}",
            self.task_id,
            self.running.load(Ordering::Relaxed)
        );

        if handle::Handle::global().is_exiting() {
            logging!(
                warn,
                Type::Tray,
                "[Task#{}] 应用正在退出，取消启动托盘速率任务",
                self.task_id
            );
            return;
        }

        if !Self::has_main_tray() {
            logging!(
                warn,
                Type::Tray,
                "[Task#{}] 托盘不可用，跳过启动托盘速率任务",
                self.task_id
            );
            return;
        }

        if self.running.load(Ordering::Relaxed) {
            logging!(
                info,
                Type::Tray,
                "[Task#{}] 托盘速率任务已在运行，无需重复启动",
                self.task_id
            );
            return;
        }

        logging!(
            info,
            Type::Tray,
            "[Task#{}] 托盘网速显示任务启动成功，setting running=true",
            self.task_id
        );
        self.running.store(true, Ordering::Relaxed);

        let task_id = self.task_id;
        let running = Arc::clone(&self.running);
        let thread_handle = thread::spawn(move || {
            let mut monitor = crate::utils::network_monitor::NetworkMonitor::new();
            let mut iteration = 0u64;

            while running.load(Ordering::Relaxed) {
                iteration += 1;
                logging!(info, Type::Tray, "[Task#{}] 托盘网速任务循环 #{}", task_id, iteration);

                if handle::Handle::global().is_exiting() {
                    logging!(
                        warn,
                        Type::Tray,
                        "[Task#{}] 应用正在退出，退出托盘网速任务循环",
                        task_id
                    );
                    running.store(false, Ordering::Relaxed);
                    break;
                }

                let (up, down) = monitor.get_speed();
                logging!(
                    info,
                    Type::Tray,
                    "[Task#{}] 系统网络监控: 上行={} 字节/秒, 下行={} 字节/秒",
                    task_id,
                    up,
                    down
                );
                Self::apply_tray_speed(up, down);

                logging!(
                    info,
                    Type::Tray,
                    "[Task#{}] 等待 {} 秒后继续下一次采样",
                    task_id,
                    TRAY_SPEED_SAMPLE_INTERVAL.as_secs()
                );
                thread::sleep(TRAY_SPEED_SAMPLE_INTERVAL);
                logging!(
                    info,
                    Type::Tray,
                    "[Task#{}] 睡眠结束，继续循环，running={}",
                    task_id,
                    running.load(Ordering::Relaxed)
                );
            }

            logging!(
                warn,
                Type::Tray,
                "[Task#{}] 托盘网速任务循环退出，总迭代次数: {}, running={}",
                task_id,
                iteration,
                running.load(Ordering::Relaxed)
            );
        });

        *self.thread_handle.lock() = Some(thread_handle);
    }

    /// 停止托盘速率采集后台任务并清除速率显示。
    fn stop_task(&self) {
        logging!(
            warn,
            Type::Tray,
            "[Task#{}] stop_task() 被调用, caller thread={:?}",
            self.task_id,
            std::thread::current().id()
        );
        self.running.store(false, Ordering::Relaxed);

        let value = self.thread_handle.lock().take();
        if let Some(handle) = value {
            let _ = handle.join();
        }

        Self::apply_tray_speed(0, 0);
        if let Some(tray) = handle::Handle::app_handle().tray_by_id("main") {
            tray_speed::clear_speed_attributed_title(&tray);
        }
    }

    fn has_main_tray() -> bool {
        handle::Handle::app_handle().tray_by_id("main").is_some()
    }

    fn apply_tray_speed(up: u64, down: u64) {
        logging!(
            debug,
            Type::Tray,
            "更新托盘网速: 上行={} 字节/秒, 下行={} 字节/秒",
            up,
            down
        );
        if let Some(tray) = handle::Handle::app_handle().tray_by_id("main") {
            tray_speed::set_speed_attributed_title(&tray, up, down);
        } else {
            logging!(warn, Type::Tray, "无法获取托盘实例，网速显示失败");
        }
    }
}

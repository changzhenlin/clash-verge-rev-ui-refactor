//! macOS 系统网络流量监控模块
//!
//! 通过 netstat 命令监控系统网络接口的字节计数，计算实时网速

use std::process::Command;
use std::time::Instant;

use crate::{Type, logging};

/// 网络接口快照
struct InterfaceSnapshot {
    bytes_in: u64,
    bytes_out: u64,
}

/// 网络流量监控器
pub struct NetworkMonitor {
    last_snapshot: Option<(InterfaceSnapshot, Instant)>,
}

impl NetworkMonitor {
    pub fn new() -> Self {
        Self { last_snapshot: None }
    }

    /// 获取当前网速（字节/秒）
    pub fn get_speed(&mut self) -> (u64, u64) {
        let now = Instant::now();
        let current_snapshot = Self::capture_snapshot();

        let result = match &self.last_snapshot {
            Some((last, last_time)) => {
                let elapsed = last_time.elapsed().as_secs_f64();
                if elapsed < 0.1 {
                    return (0, 0);
                }

                let up_diff = current_snapshot.bytes_out.saturating_sub(last.bytes_out);
                let down_diff = current_snapshot.bytes_in.saturating_sub(last.bytes_in);

                let up_speed = (up_diff as f64 / elapsed) as u64;
                let down_speed = (down_diff as f64 / elapsed) as u64;

                (up_speed, down_speed)
            }
            None => (0, 0),
        };

        self.last_snapshot = Some((current_snapshot, now));
        result
    }

    /// 通过 netstat 命令捕获当前所有网络接口的字节计数
    fn capture_snapshot() -> InterfaceSnapshot {
        let mut total_bytes_in = 0u64;
        let mut total_bytes_out = 0u64;

        if let Ok(output) = Command::new("netstat").arg("-ibn").output() {
            let output_str = String::from_utf8_lossy(&output.stdout);

            for line in output_str.lines() {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() < 10 {
                    continue;
                }

                let iface_name = parts[0];
                // 跳过回环接口和虚拟隧道接口
                if iface_name.starts_with("lo") || iface_name.starts_with("utun") {
                    continue;
                }

                // 只统计物理接口的 <Link#> 行，跳过 IP 地址行
                // 物理接口行的 Network 列是 <Link#X> 格式
                // IP 地址行的 Network 列是 IP 地址或主机名
                let network_col = parts[2];
                if !network_col.starts_with("<Link") {
                    continue;
                }

                if let (Ok(rx), Ok(tx)) = (parts[6].parse::<u64>(), parts[9].parse::<u64>()) {
                    total_bytes_in = total_bytes_in.saturating_add(rx);
                    total_bytes_out = total_bytes_out.saturating_add(tx);
                }
            }

            logging!(
                info,
                Type::Tray,
                "netstat 捕获结果: 总接收={} 字节, 总发送={} 字节",
                total_bytes_in,
                total_bytes_out
            );
        } else {
            logging!(warn, Type::Tray, "netstat 命令执行失败");
        }

        InterfaceSnapshot {
            bytes_in: total_bytes_in,
            bytes_out: total_bytes_out,
        }
    }
}

//! macOS 托盘速率渲染模块
//!
//! 使用 Tauri TrayIcon.set_title() 显示网速文本

use std::cell::RefCell;

use crate::utils::speed::format_bytes_per_second;
use tauri::tray::TrayIcon;

thread_local! {
    static LAST_DISPLAY_STR: RefCell<String> = const { RefCell::new(String::new()) };
}

fn format_tray_speed(up: u64, down: u64) -> String {
    let up_str = format_bytes_per_second(up);
    let down_str = format_bytes_per_second(down);
    format!("↑{} ↓{}", up_str, down_str)
}

pub fn set_speed_attributed_title(tray: &TrayIcon, up: u64, down: u64) {
    let speed_text = format_tray_speed(up, down);

    let changed = LAST_DISPLAY_STR.with(|last| {
        let mut last_borrow = last.borrow_mut();
        if *last_borrow == speed_text {
            false
        } else {
            *last_borrow = speed_text.clone();
            true
        }
    });

    if !changed {
        return;
    }

    let _ = tray.set_title(Some(&speed_text));
}

pub fn reset_last_display() {
    LAST_DISPLAY_STR.with(|last| {
        *last.borrow_mut() = String::new();
    });
}

pub fn clear_speed_attributed_title(tray: &TrayIcon) {
    let _ = tray.set_title(None::<&str>);
    reset_last_display();
}

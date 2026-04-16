#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// 检查verge配置文件
const vergeConfigPath = path.join(process.env.HOME, '.config', 'clash-verge', 'verge.yaml');

console.log('=== 检查 macOS 托盘网速显示功能 ===\n');

// 检查配置文件
if (fs.existsSync(vergeConfigPath)) {
    console.log('✓ 找到 verge.yaml 配置文件');
    const configContent = fs.readFileSync(vergeConfigPath, 'utf8');
    const hasTraySpeed = configContent.includes('enable_tray_speed: true');
    
    if (hasTraySpeed) {
        console.log('✓ enable_tray_speed 已启用');
    } else {
        console.log('⚠️ enable_tray_speed 未启用，需要在设置中开启');
    }
} else {
    console.log('⚠️ 未找到 verge.yaml 配置文件');
}

// 检查Clash核心状态
console.log('\n=== 检查 Clash 核心状态 ===');

try {
    const status = spawn('curl', ['-s', 'http://localhost:9090/status']);
    status.stdout.on('data', (data) => {
        const result = JSON.parse(data.toString());
        console.log('✓ Clash 核心运行正常');
        console.log('  - 版本:', result.version);
        console.log('  - 运行时间:', result.uptime);
    });
    status.stderr.on('data', (data) => {
        console.log('⚠️ Clash 核心未运行或无法访问');
    });
} catch (error) {
    console.log('⚠️ 检查 Clash 核心状态时出错:', error.message);
}

console.log('\n=== 功能说明 ===');
console.log('1. 在 Clash Verge 设置 → 外观设置中开启 "菜单栏显示网速"');
console.log('2. 确保 Clash 核心正在运行（有网络流量）');
console.log('3. 查看 macOS 顶部菜单栏是否显示上传/下载速率');
console.log('4. 速率格式：上行速率在上，下行速率在下');
console.log('\n如果仍未显示，请重启应用后再试。');

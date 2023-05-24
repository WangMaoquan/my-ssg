import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * e2e测试需要哪些条件
 * 1. 创建测试项目
 * 2. 启动测试项目
 * 3. 开启无头浏览器(无头浏览器指的是没有图形用户界面的浏览器)进行访问
 */
const config: PlaywrightTestConfig = {
  testDir: './e2e', // 测试的文件夹
  timeout: 50000, // 超时时间
  webServer: {
    url: 'http://localhost:5173', // 服务地址
    command: 'pnpm prepare:e2e' // 指令
  },
  use: {
    headless: true // 没有ui界面
  }
};

export default config;

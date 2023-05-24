import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node', // 指定测试环境
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'], // 排除文件夹
    threads: true // 开启多线程
  }
});

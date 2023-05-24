import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');

const ROOT = path.resolve(__dirname, '..');

// 将子进程的 log 信息展示到 父进程
const defaultOptions = {
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2E() {
  if (!fs.existsSync(path.resolve(__dirname, '../dist'))) {
    // 不存在目标目录, 就执行 pnpm build
    execa.commandSync('pnpm build', {
      cwd: ROOT, // 指定根目录
      ...defaultOptions
    });
  }

  // 安装无头浏览器环境
  // 第一次下载会很久
  execa.commandSync('npx playwright install', {
    cwd: ROOT,
    ...defaultOptions
  });

  execa.commandSync('pnpm dev', {
    cwd: exampleDir,
    ...defaultOptions
  });
}

prepareE2E();

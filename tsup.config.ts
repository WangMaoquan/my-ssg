import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/node/cli.ts'],
  bundle: true, // 开启bundle 模式
  splitting: true, // 开启拆包功能
  outDir: 'dist', // 产物输出目录
  format: ['cjs', 'esm'], // 产物的格式
  dts: true, // 类型文件生成
  shims: true,
});

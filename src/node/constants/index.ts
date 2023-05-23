import { join } from 'path';

/**
 *  __dirname 只在 node 环境中存在的
 * 我们是用的 esm 所以会报错  __dirname is not defined in ES module scope
 * 怎么解决呢?
 * tsup 开始 shims 可以理解为 不同环境之前 api 的兼容实现
 */
export const PACKAGE_ROOT = join(__dirname, '..');

export const DEFAULT_TEMPLATE_PATH = join(PACKAGE_ROOT, 'template.html');

export const CLIENT_ENTRY_PATH = join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'client-entry.tsx',
);

export const SERVER_ENTRY_PATH = join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'ssr-entry.tsx',
);

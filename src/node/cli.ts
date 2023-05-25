import cac from 'cac';
import { build } from './build';
import { resolveConfig } from './config';
import { resolve } from 'path';
const cli = cac('decade').version('0.0.1').help();

/**
 * https://github.com/cacjs/cac#readme
 * command 注册 命令行
 * .action 执行回调
 */
cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  // 使用 dev.ts 最后打包的产物
  const createServer = async () => {
    const { createDevServer } = await import('./dev.js');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
    console.log('dev', root);
  };
  await createServer();
});

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    root = resolve(root);
    const config = await resolveConfig(root, 'build', 'production');
    await build(root, config);
    console.log('build', root);
  });

cli.parse();

import cac from 'cac';
import { createDevServer } from './dev';

const cli = cac('decade').version('0.0.1').help();

/**
 * https://github.com/cacjs/cac#readme
 * command 注册 命令行
 * .action 执行回调
 */
cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
  console.log('dev', root);
});

cli
  .command('build [root]', 'build in production')
  .action(async (root: string) => {
    console.log('build', root);
  });

cli.parse();

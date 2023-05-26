import { RestartDevServer } from 'node/dev';
import { pluginIndexHtml } from './plugins-decade/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugins-decade/config';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from 'node';
import { pluginMdxRollup } from './plugin-mdx/pluginMdxRollup';

interface CreateVitePluginOptions {
  config: SiteConfig;
  restart?: RestartDevServer;
}

export function createVitePlugins({
  config,
  restart
}: CreateVitePluginOptions) {
  return [
    pluginIndexHtml(),
    pluginReact(),
    pluginConfig(config, restart),
    pluginRoutes({
      root: config.root
    }),
    pluginMdxRollup()
  ];
}

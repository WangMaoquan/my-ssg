import { pluginMdxRollup } from './pluginMdxRollup';

export async function createMDxPlugins() {
  return [await pluginMdxRollup()];
}

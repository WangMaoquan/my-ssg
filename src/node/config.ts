import fs from 'fs-extra';
import { resolve } from 'path';
import { Rollup, loadConfigFromFile } from 'vite';
import { SiteConfig, UserConfig } from '../shared/types';

const supportConfigFiles = ['config.ts', 'config.js'];

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

function getUserConfigPath(root: string) {
  try {
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (e) {
    console.log('Failed to load user config');
    throw e;
  }
}

export async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
): Promise<[string, UserConfig]> {
  // 1. 获取配置文件路径 支持 js/ ts
  const configPath = getUserConfigPath(root);
  // 2. 读取配置文件的内容 使用 vite 内置的方法
  const result = (await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  )) as {
    path: string;
    config: RawConfig;
    dependencies: string[];
  }; // 这一步是让 loadConfigFromFile 返回的 config 变成 RawConfig

  if (result) {
    const { config: rawConfig = {} } = result;
    // 1. object
    // 2. promise
    // 3. function

    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);

    return [configPath, userConfig];
  } else {
    return [configPath, {}];
  }
}

function resolveSiteData(useConfig: UserConfig) {
  return {
    description: useConfig.description || 'decade',
    title: useConfig.title || 'wxm',
    vite: useConfig.vite || {},
    themeConfig: useConfig.themeConfig || {}
  } as UserConfig;
}

export async function resolveConfig(
  root: string, // 项目根目录
  command: 'serve' | 'build', // 指令
  mode: 'development' | 'production' // 模式
) {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  return {
    configPath,
    siteData: resolveSiteData(userConfig),
    root
  } as SiteConfig;
}

export function defineConfig(config: UserConfig): UserConfig;
// export function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>;
export function defineConfig(config: () => UserConfig): () => UserConfig;
export function defineConfig(
  config: () => Promise<UserConfig>
): () => Promise<UserConfig>;

export function defineConfig(config: RawConfig) {
  return config;
}

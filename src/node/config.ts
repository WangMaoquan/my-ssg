import fs from 'fs-extra';
import { resolve } from 'path';
import { loadConfigFromFile } from 'vite';
import { UserConfig } from '../shared/types';

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

export async function resolveConfig(
  root: string, // 项目根目录
  command: 'serve' | 'build', // 指令
  mode: 'development' | 'production' // 模式
) {
  // 1. 获取配置文件路径 支持 js/ ts
  const configPath = getUserConfigPath(root);
  // 2. 读取配置文件的内容 使用 vite 内置的方法
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    // 1. object
    // 2. promise
    // 3. function

    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);

    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
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

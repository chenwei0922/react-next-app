import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//给public中资源，添加子目录前缀
export const getAssetUrl = (path: string) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; // 或者你的 assetPrefix
  return `${basePath}${path}`;
};
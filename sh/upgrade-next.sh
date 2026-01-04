#!/bin/bash
echo "开始升级 Next.js..."

# 备份当前依赖
cp package.json package.json.bak

# 升级核心包
pnpm install next@latest react@latest react-dom@latest

# 升级开发依赖
pnpm install --save-dev @types/react@latest @types/react-dom@latest eslint-config-next@latest

# 清理并重新安装
rm -rf node_modules package-lock.json
pnpm install

echo "升级完成！"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 关键：启用静态导出
  trailingSlash: true, // 确保 URL 以斜杠结尾
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js 图片优化
  },
  // 如果你的仓库不是 username.github.io，需要设置 basePath
  // basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '',
}

module.exports = nextConfig

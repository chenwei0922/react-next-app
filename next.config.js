/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 关键：启用静态导出
  trailingSlash: true, // 确保 URL 以斜杠结尾
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js 图片优化
    // domains: ['example.com'], // 允许的外部域名
    // formats: ['image/webp', 'image/avif'], // 支持的格式
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // domains: ['resources.playvrs.net', 'placehold.co'],
    // dangerouslyAllowSVG: true,
    // contentDispositionType: 'attachment',
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'placehold.co',
    //     port: '',
    //     pathname: '/**'
    //   }
    // ]
  },
  experimental: {
    turbo: {
      // 这里可以配置 ignorePatterns
      // ignorePatterns: ['public/flags/**', 'public/geo/**', 'public/images/**', 'public/fonts/**', 'scripts/**']
    }
  },
  // basePath: '/react-next-app', // 替换为你的仓库名称
  // 如果你的仓库不是 username.github.io，需要设置 basePath
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // basePath: process.env.NODE_ENV === 'production' ? '/out' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/out' : '',
  // 确保所有资源路径正确
  
  // 自定义 webpack 配置（如果需要）
  // webpack: (config) => {
  //   config.module.rules.push({
  //     test: /\.(png|jpg|gif|svg)$/i,
  //     use: [
  //       {
  //         loader: 'url-loader',
  //         options: {
  //           limit: 8192, // 8KB 以下转为 base64
  //           fallback: 'file-loader',
  //           publicPath: '/_next/static/images/',
  //           outputPath: 'static/images/',
  //           name: '[name]-[hash].[ext]',
  //         },
  //       },
  //     ],
  //   });
  //   return config;
  // },
}

module.exports = nextConfig

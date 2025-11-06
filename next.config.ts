import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const nextConfig: NextConfig = {
  //next start是一个nodejs服务器，静态导出后，你就不再需要nodejs服务器，只需要一个静态文件服务器
  // output: 'export', // 关键：启用静态导出
  output: basePath ? 'export' : undefined,
  trailingSlash: true, // 确保 URL 以斜杠结尾
  reactStrictMode: false,
  generateEtags: false,
  poweredByHeader: false,
  async headers() {
    const cspAllowDmains = [
      "'self'",
    ]
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors ${cspAllowDmains.join(' ')};`
          }
        ]
      }
    ]
  },
  images: {
    unoptimized: basePath ? true : false, // GitHub Pages 不支持 Next.js 图片优化
    //deprecated, use remotePatterns
    // domains: ['resources.playvrs.net', 'resources.xterio.net', 'resources.xter.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resources.playvrs.net',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'resources.xterio.net',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'resources.xter.io',
        port: '',
        pathname: '/**'
      }
    ],
    // 优化设备断点
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2560],
    // 优化图片尺寸
    imageSizes: [32, 64, 96, 128, 256, 384, 512],
  
    // // 其他优化配置
    formats: ['image/webp', 'image/avif'],
    // minimumCacheTTL: 60 * 60 * 6, // 6小时
    // dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // deviceSizes: [700, 800, 900, 1100, 1200, 2000, 2100],
    // imageSizes: [100, 200, 300, 400, 500, 600]
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
  compress: true,
  // basePath: '/react-next-app', // 替换为你的仓库名称
  // 如果你的仓库不是 username.github.io，需要设置 basePath
  basePath: basePath,
  assetPrefix: basePath,
  // basePath: process.env.NODE_ENV === 'production' ? '/out' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/out' : '',
  // 配置代理
  // async rewrites() {
  //   // Example:
  //   return [{ source: '/xgc/:path*', destination: 'https://api.xter.io/xgc/:path*' }];
  // },

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

export default nextConfig;

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

//自定义域名，可在public目录下创建 CNAME 文件
```text
yourdomain.com
```
部署到gitpage静态网站注意事项：
❌ 不能使用：API Routes、服务端组件、getServerSideProps
✅ 可以使用：静态生成、客户端组件
如果需要动态数据，使用客户端数据获取

// 这些在静态导出中无法工作：
// - 服务端组件 (async 组件)
// - API Routes (/app/api/ 目录)
// - getServerSideProps
// - 动态服务端渲染

## 保留文件名
error, global-error, error, loading, not-found,

## api route
curl -X PUT http://localhost:3002/api/hello
curl http://localhost:3002/api/hello

# 使用 serve 在本地模拟 GitHub Pages 环境
npm install -g serve

# 在 out 目录中启动服务器，模拟子路径
cd out
serve -s . -l 3000
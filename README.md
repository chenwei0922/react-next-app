This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

`pnpm dedupe` 去重命令，合并相同版本依赖


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


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

## 集成测试
`npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest`
### jest
> jest, 单元/组件测试，适用于测试单个函数、组件逻辑、渲染结果、用户交互。
- `describe` 描述被测试的功能模块，用于创建一个测试套件，将相关测试用例分组
  ```ts
  describe('Home Page', () => {
    // 测试用例
  })
  ```
- `it` 测试用例，定义单个测试用例，测试描述+测试函数，描述具体的测试行为，也可以用test()
  ```ts
  it('renders main heading', () => {
    // 测试逻辑
  })
  ```
- `render` 渲染组件，在测试环境渲染React组件，来源于`@testing-library/react`，创建虚拟Dom，使组件可用于测试。
  ```ts
  render(<Page />)
  ```
- `screen` `Testing Library` 提供的全局对象，包含所有查询方法。`getByText`通过文本内容查找元素，在渲染的组件中查找包含指定文本的元素。`getByRole`通过元素的 ARIA 角色来查找元素，指定要查找的角色是标题，标题级别是1
  ```ts
  const heading = screen.getByText(/Get started by editing/i)
  const heading = screen.getByRole('heading', { level: 1 })  //等价于查找 <h1>标题内容</h1>
  ```
- `expect` 创建断言，针对找到的标题元素，`toBeInTheDocument` 匹配器，检查元素是否在dom中。验证元素确实被渲染并显示。
  ```ts
  expect(heading).toBeInTheDocument()
  expect(1+1).toBe(2) //1+1等于2
  expect({name:1}).toEqual({name:1}) //对象比较
  expect(1+1).not.toBe(3) //1+1不等3
  expect(3).toBeLessThan(5) //3<5
  expect('hello').toContain('h') 
  expect('hello').toMatch(/h/)
  ```

### cypress
> cypress，端到端测试(E2E)，测试完整用户流程，如页面导航，跨页面交互

## 埋点,神策
```html
<!-- G-ZL1YVF18VG -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZL1YVF18VG"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-ZL1YVF18VG');
</script>
```

## Claude code router 配置

## 配置MongoDB

```
https://www.mongodb.com/try/download/enterprise

手动将内容 copy /usr/local/mongdb
配置变量： export PATH=$PATH:/usr/local/mongodb-6.0.26/bin
验证： mongod -version

启动: mongod --dbpath <path>
比如：mongod --dbpath /Users/chen/working/chen/react-next-app/koa-server/src/config
浏览器访问：http://localhost:27017/
看到：It looks like you are trying to access MongoDB over HTTP on the native driver port. 
即表示成功
```

## Koa 电商后端 (新)
位于 `koa-server/`。提供基础接口：`/api/auth`、`/api/products`、`/api/orders`、`/api/users`。

运行步骤：

```bash
cd koa-server
# 安装依赖（推荐 pnpm）
pnpm install

# 设置环境变量（创建 .env 文件）
# MONGODB_URI=mongodb://localhost:27017/koa_ecommerce
# JWT_SECRET=your_secure_secret
# PORT=5050

# 启动开发服务
pnpm dev
# 或生产模式
pnpm start
```

基础接口：
- POST `/api/auth/register` 注册
- POST `/api/auth/login` 登录
- GET `/api/products` 列表；GET `/api/products/:id` 详情
- 需要登录：
  - POST `/api/products` 新建商品；PUT/DELETE `/api/products/:id`
  - POST `/api/orders` 下单；GET `/api/orders/mine` 我的订单；GET `/api/orders/:id` 订单详情
  - GET `/api/users/me` 个人信息

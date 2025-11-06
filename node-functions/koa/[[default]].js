// 文件路径 ./node-functions/express/[[default]].js
import Koa from "koa";
const app = Koa();

// 添加根路由处理，访问路径 example.com/express/
app.get("/test", (ctx) => {
  ctx.body = { message: "Hello from Express on Node Functions!" }
});

export default app;
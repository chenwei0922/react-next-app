import Koa from "koa";
import Router from "koa-router";

const app = new Koa();

const router = new Router();
router.get("/test", (ctx) => {
  ctx.body = { message: "Koa API is running..." };
});

app.use(router.routes());

export default app;
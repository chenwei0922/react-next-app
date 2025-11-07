import 'dotenv/config';
import Koa from "koa";
import Router from "koa-router";
import { register, login } from './controllers/authController'

import connectDB from './config/db'
connectDB();

const app = new Koa();

// Error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message || 'Server Error' };
  }
});

app.use(cors());
app.use(bodyParser());

const router = new Router();
router.get("/test", (ctx) => {
  ctx.body = { message: "Koa API is running..." };
});
router.post('/auth/register', register);
router.post('/auth/login', login);

app.use(router.routes(), router.allowedMethods());

export default app;
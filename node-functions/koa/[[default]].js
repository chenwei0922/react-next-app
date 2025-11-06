const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const router = require('../src/routes');
const connectDB = require('../src/config/db');

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

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;



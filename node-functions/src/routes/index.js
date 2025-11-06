const Router = require('koa-router');
const { requireAuth } = require('../middleware/auth');
const auth = require('./modules/auth');
const products = require('./modules/products');
const orders = require('./modules/orders');
const users = require('./modules/users');

const router = new Router({ prefix: '/api' });

router.use(auth.routes(), auth.allowedMethods());
router.use('/products', products.routes(), products.allowedMethods());
router.use('/orders', requireAuth(), orders.routes(), orders.allowedMethods());
router.use('/users', requireAuth(), users.routes(), users.allowedMethods());

router.get('/', (ctx) => {
  ctx.body = { message: 'Koa API is running...' };
});

module.exports = router;



const Router = require('koa-router');
const { createOrder, getMyOrders, getOrderById } = require('../../controllers/orderController');

const router = new Router();

router.post('/', createOrder);
router.get('/mine', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;



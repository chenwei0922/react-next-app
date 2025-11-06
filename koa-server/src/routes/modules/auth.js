const Router = require('koa-router');
const { register, login } = require('../../controllers/authController');

const router = new Router({ prefix: '/auth' });

router.post('/register', register);
router.post('/login', login);

module.exports = router;



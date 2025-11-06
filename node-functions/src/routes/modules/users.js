const Router = require('koa-router');
const { getProfile } = require('../../controllers/userController');

const router = new Router();

router.get('/me', getProfile);

module.exports = router;



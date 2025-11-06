const Router = require('koa-router');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../../controllers/productController');
const { requireAuth } = require('../../middleware/auth');

const router = new Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth(), createProduct);
router.put('/:id', requireAuth(), updateProduct);
router.delete('/:id', requireAuth(), deleteProduct);

module.exports = router;



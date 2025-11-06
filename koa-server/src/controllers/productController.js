const Product = require('../models/Product');

exports.getProducts = async (ctx) => {
  const products = await Product.find({});
  ctx.body = products;
};

exports.getProductById = async (ctx) => {
  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.status = 404;
    ctx.body = { message: 'Product not found' };
    return;
  }
  ctx.body = product;
};

exports.createProduct = async (ctx) => {
  const { name, description, price, image, category, countInStock } = ctx.request.body || {};
  const product = new Product({ name, description, price, image, category, countInStock });
  const created = await product.save();
  ctx.status = 201;
  ctx.body = created;
};

exports.updateProduct = async (ctx) => {
  const { name, description, price, image, category, countInStock } = ctx.request.body || {};
  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.status = 404;
    ctx.body = { message: 'Product not found' };
    return;
  }
  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.image = image ?? product.image;
  product.category = category ?? product.category;
  product.countInStock = countInStock ?? product.countInStock;
  const updated = await product.save();
  ctx.body = updated;
};

exports.deleteProduct = async (ctx) => {
  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.status = 404;
    ctx.body = { message: 'Product not found' };
    return;
  }
  await product.deleteOne();
  ctx.body = { message: 'Product removed' };
};



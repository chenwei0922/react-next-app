import Order from'../models/Order'
import Product from'../models/Product'

export const createOrder = async (ctx) => {
  const { orderItems = [], shippingAddress, paymentMethod } = ctx.request.body || {};
  if (!orderItems.length) {
    ctx.status = 400;
    ctx.body = { message: 'No order items' };
    return;
  }

  // Calculate totals
  let itemsPrice = 0;
  const expandedItems = [];
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      ctx.status = 400;
      ctx.body = { message: `Product not found: ${item.product}` };
      return;
    }
    const linePrice = product.price * item.qty;
    itemsPrice += linePrice;
    expandedItems.push({
      product: product._id,
      name: product.name,
      qty: item.qty,
      price: product.price,
      image: product.image
    });
  }
  const taxPrice = Math.round(itemsPrice * 0.1 * 100) / 100;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = new Order({
    user: ctx.state.userId,
    orderItems: expandedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });
  const created = await order.save();
  ctx.status = 201;
  ctx.body = created;
};

export const getMyOrders = async (ctx) => {
  const orders = await Order.find({ user: ctx.state.userId }).sort({ createdAt: -1 });
  ctx.body = orders;
};

export const getOrderById = async (ctx) => {
  const order = await Order.findById(ctx.params.id).populate('user', 'name email');
  if (!order) {
    ctx.status = 404;
    ctx.body = { message: 'Order not found' };
    return;
  }
  ctx.body = order;
};



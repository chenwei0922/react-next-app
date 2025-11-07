const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

exports.register = async (ctx) => {
  const { email, password, name } = ctx.request.body || {};
  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Please provide email and password' };
    return;
  }
  const exists = await User.findOne({ email });
  if (exists) {
    ctx.status = 400;
    ctx.body = { message: 'User already exists' };
    return;
  }
  const user = new User({ email, password, name });
  await user.save();
  const token = signToken(user._id);
  ctx.status = 201;
  ctx.body = { _id: user._id, name: user.name, email: user.email, token };
};

exports.login = async (ctx) => {
  const { email, password } = ctx.request.body || {};
  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Please provide email and password' };
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid credentials' };
    return;
  }
  const ok = await user.matchPassword(password);
  if (!ok) {
    ctx.status = 401;
    ctx.body = { message: 'Invalid credentials' };
    return;
  }
  const token = signToken(user._id);
  ctx.body = { _id: user._id, name: user.name, email: user.email, token };
};



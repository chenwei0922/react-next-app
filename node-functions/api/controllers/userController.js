import User from'../models/User'

export const getProfile = async (ctx) => {
  const user = await User.findById(ctx.state.userId).select('-password');
  if (!user) {
    ctx.status = 404;
    ctx.body = { message: 'User not found' };
    return;
  }
  ctx.body = user;
};



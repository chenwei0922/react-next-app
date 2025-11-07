const jwt = require('jsonwebtoken');

function requireAuth() {
  return async function authMiddleware(ctx, next) {
    const authHeader = ctx.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { message: 'Not authorized, no token' };
      return;
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ctx.state.userId = decoded.id;
      await next();
    } catch (err) {
      ctx.status = 401;
      ctx.body = { message: 'Not authorized, token failed' };
    }
  };
}

module.exports = { requireAuth };



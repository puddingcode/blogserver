'use strict';
module.exports = ({ app }) => {
  return async function verity(ctx, next) {
    const authorization = ctx.request.header.authorization;
    if (authorization) {
      try {
        const token = authorization.replace('Bearer', '');
        const ret = await app.jwt.verify(token, app.config.jwt.secret);
        ctx.state.nickName = ret.nickName;
        ctx.state.userid = ret._id;
        await next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          ctx.body = {
            code: -666,
            message: '登录过期',
          };
        }
      }
    } else {
      await next();
    }

  };
};

'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller,
  } = app;
  const jwt = app.middleware.jwt({
    app,
  });
  router.get('/', controller.home.index);
  router.get('/user/captcha', controller.user.captcha);
  router.post('/user/checkNickNameStatus', controller.user.checkNickNameStatus);
  router.post('/user/register', controller.user.create);
  router.post('/user/login', controller.user.login);
  router.post('/user/managelogin', controller.user.managelogin);
  router.post('/user/checkEmail', controller.user.checkEmailRepeat);
  router.post('/user/checkNickName', controller.user.checkNickNameRepeat);
  router.post('/user/checkCaptcha', controller.user.checkCaptchaErr);
  router.get('/user/info', jwt, controller.user.info);
  router.put('/user/follow/:id', jwt, controller.user.follow);
  router.delete('/user/follow/:id', jwt, controller.user.unfollow);
  router.get('/user/isFollow/:id', jwt, controller.user.isFollow);

  router.get('/user/:id/followers', jwt, controller.user.followers);
  router.get('/user/:id/following', jwt, controller.user.following);
  router.get('/user/userlist', controller.user.userlist);

  router.get('/article', controller.article.list);
  router.post('/article/create', jwt, controller.article.create);
  router.post('/article/update', jwt, controller.article.update);
  router.get('/article/:id', controller.article.getArticleById);
  router.get('/article/isLike/:id', jwt, controller.article.isLike);
  router.get('/article/isDislike/:id', jwt, controller.article.isDislike);
  router.put('/article/like/:id', jwt, controller.article.like);
  router.put('/article/dislike/:id', jwt, controller.article.dislike);
  router.delete('/article/dislike/:id', jwt, controller.article.cancelDislike);
  router.delete('/article/like/:id', jwt, controller.article.cancelLike);
  router.get('/article/getArticleLikes/:id', controller.article.getLikesNumber);
  router.get('/article/getArticleDislikes/:id', controller.article.getDislikesNumber);
  router.delete('/article/:id', jwt, controller.article.deleteArticle);
  router.get('/article/editArticle/:id', jwt, controller.article.editArticle);

  router.get('/comments/getComments', controller.comments.getComments);
  router.post('/comments/addComment', jwt, controller.comments.addComment);
  router.delete('/comments/deleteComment/:id', jwt, controller.comments.deleteComment);
};

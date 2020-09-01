'use strict';

const BaseController = require('./base');

class ArticleController extends BaseController {
  async list() {
    const { ctx } = this;
    const ret = await ctx.model.Article.find().populate('author');
    ret.forEach(v => v.author.password = '');
    this.success(ret);
  }
  async create() {
    const { ctx } = this;
    const { userid } = ctx.state;
    const { title, content, contentMd } = ctx.request.body;
    const obj = {
      title,
      article: contentMd,
      article_html: content,
      author: userid,
    };
    const ret = await ctx.model.Article.create(obj);
    if (ret._id) {
      this.success({
        id: ret._id,
        title: obj.title,
      });
    } else {
      this.error('创建失败');
    }
  }
  async update() {
    const { ctx } = this;
    const { title, content, contentMd, id } = ctx.request.body;
    await ctx.model.Article.updateOne({ _id: id }, { title, article: contentMd, article_html: content });
    this.success('更新成功');
  }
  async getArticleById() {
    const { ctx } = this;
    const ret = await ctx.model.Article.findById(ctx.params.id).populate('author');
    Array.from(ret).forEach(v => v.author.password = '');
    ret.views += 1;
    ret.save();
    if (ret._id) {
      this.success(ret);
    }
  }

  async deleteArticle() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    if (me._id) {
      const ret = await ctx.model.Article.deleteOne({ _id: ctx.params.id });
      if (ret.deletedCount) {
        this.success('删除成功');
      } else {
        this.error('删除失败');
      }
    }
  }
  async editArticle() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    const obj = {
      title: me.title,
      content_md: me.article,
      content_html: me.article_html,
      id: ctx.params.id,
    };
    this.success(obj);
  }
  async like() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    const isLike = me.likes.find(v => v.toString() === ctx.state.userid);
    if (!isLike) {
      me.likes.push(ctx.state.userid);
      me.save();
      this.success(me.likes);
    } else {
      this.error('已经点赞');
    }
  }
  async cancelLike() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    const index = me.likes.map(id => id.toString()).indexOf(ctx.state.userid);
    if (index > -1) {
      me.likes.splice(index, 1);
      me.save();
      this.success('取消点赞');
    } else {
      this.error('取消点赞失败');
    }

  }
  async cancelDislike() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    const index = me.dislikes.map(id => id.toString()).indexOf(ctx.state.userid);
    if (index > -1) {
      me.dislikes.splice(index, 1);
      me.save();
      this.success('取消诋踩');
    } else {
      this.error('取消诋踩失败');
    }
  }
  async dislike() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    const isDislike = me.dislikes.find(v => v.toString() === ctx.state.userid);
    if (!isDislike) {
      me.dislikes.push(ctx.state.userid);
      me.save();
      this.success('踩成功');
    } else {
      this.error('已经踩过');
    }
  }
  async isLike() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    const isLike = me.likes.find(v => v.toString() === ctx.state.userid);
    this.success({ isLike });
  }
  async isDislike() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    const isDislike = me.dislikes.find(v => v.toString() === ctx.state.userid);
    this.success({ isDislike });
  }
  async getLikesNumber() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    if (me._id) {
      this.success(Array.from(me.likes).length);
    }
  }
  async getDislikesNumber() {
    const { ctx } = this;
    const me = await ctx.model.Article.findById(ctx.params.id);
    if (me._id) {
      this.success(Array.from(me.dislikes).length);
    }
  }
}

module.exports = ArticleController;

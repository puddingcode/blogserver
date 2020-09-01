'use strict';

const BaseController = require('./base');

class CommentsController extends BaseController {
  async getComments() {
    const { ctx } = this;
    const ret = await ctx.model.Comment.find().populate('commentId');
    this.success(ret);
  }
  async addComment() {
    const { ctx } = this;
    const { userid, nickName } = ctx.state;
    const { comment } = ctx.request.body;
    const obj = {
      content: comment,
      commentId: userid,
      nickName,
    };
    const ret = await ctx.model.Comment.create(obj);
    if (ret._id) {
      this.success('添加成功');
    }
  }
  async deleteComment() {
    const { ctx } = this;
    const commentId = ctx.params.id;
    if (commentId) {
      await ctx.model.Comment.findOneAndDelete({ _id: commentId }, (error, res) => {
      });
    }
    this.success('删除成功');
  }
}


module.exports = CommentsController;

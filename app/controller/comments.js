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
        let { userid, nickName } = ctx.state;
        const { comment } = ctx.request.body;
        let obj = {
            content: comment,
            commentId: userid,
            nickName: nickName
        }
        let ret = await ctx.model.Comment.create(obj);
        if(ret._id){
            this.success('添加成功')
        }
    }
}


module.exports = CommentsController
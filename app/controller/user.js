'use strict';

const BaseController = require('./base');
const md5 = require('md5');

const ps = 'alisoncode'

class UserController extends BaseController {
    // 验证码验证
    async captcha() {
        const { ctx } = this;
        const captcha = this.service.tools.captcha();
        ctx.response.type = 'image/svg+xml';
        ctx.body = captcha.data;
        console.log('图片验证码', captcha.text);
        ctx.session.captcha = captcha.text;
    }
    async checkEmail(email) {
        const user = await this.ctx.model.User.findOne({ email });
        return user;
    }
    async checkNickName(nickName) {
        const user = await this.ctx.model.User.findOne({ nickName });
        return user;
    }
    // 创建新用户
    async create() {
        const { ctx } = this;
        // console.log(ctx.session);
        const { email, password, nickName } = ctx.request.body;
        let ret = await ctx.model.User.create({
            email,
            nickName,
            password: md5(password + ps)
        })
        if (ret._id) {
            this.success('新增成功');
        }
    }
    async login() {
        const { ctx, app } = this;
        const { nickName, password } = ctx.request.body;
        let user = await ctx.model.User.findOne({
            nickName,
            password: md5(password + ps)
        })
        if (user) {
            const token = app.jwt.sign({
                nickName,
                _id: user._id
            }, app.config.jwt.secret, {
                expiresIn: '1h'
            })
            this.success({ token, nickName})
        } else {
            this.error('用户名密码错误')
        }
    }
    async checkNickNameStatus() {
        const { ctx } = this;
        const { nickName } = ctx.request.body;

        if (await ctx.model.User.findOne({ nickName })) {
            this.success('success');
        } else {
            this.error('该用户尚未注册')
        }
    }
    async checkEmailRepeat() {
        const { ctx } = this;
        const { email } = ctx.request.body;
        if (await this.checkEmail(email)) {
            return this.error('邮箱重复')
        } else {
            return this.success('成功')
        }
    }
    async checkNickNameRepeat() {
        const { ctx } = this;
        const { nickName } = ctx.request.body;
        if (await this.checkNickName(nickName)) {
            return this.error('用户名重复')
        } else {
            return this.success('success')
        }
    }
    async checkCaptchaErr() {
        const { ctx } = this;
        const { captcha } = ctx.request.body;
        console.log(captcha.UpperCase);
        console.log(ctx.session.captcha.UpperCase);

        if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
            this.success('success');
        } else {
            this.error('验证码错误')
        }
    }

    async info() {
        const { ctx } = this;
        let { nickName } = ctx.state;
        const user = await this.checkNickName(nickName);
        this.success(user);
    }

    async follow() {
        // 把关注的用户id放在following字段里面
        const { ctx } = this;
        let me = await ctx.model.User.findById(ctx.state.userid);
        let isFollow = me.following.find(v => v.toString() === ctx.params.id);
        if (!isFollow) {
            me.following.push(ctx.params.id);
            me.save();
            this.message('关注成功');
        } else {
            this.message('已经关注');
        }
    }
    async unfollow() {
        const { ctx } = this;
        let me = await ctx.model.User.findById(ctx.state.userid);
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
        console.log(index);
        if (index > -1) {
            me.following.splice(index, 1);
            me.save();
            this.message('取消关注成功');
        } else {
            this.message('尚未关注');
        }
    }
    async isFollow() {
        const { ctx } = this;
        const me = await ctx.model.User.findById(ctx.state.userid);
        let isFollow = me.following.find(v => v.toString() === ctx.params.id);
        console.log(isFollow)
        this.success({ isFollow });
    }
    // 获取粉丝名单
    async followers() {
        const { ctx } = this;
        const user = await ctx.model.User.find({ following: ctx.params.id });
        this.success(user);
    }
    // 获取关注人名单
    async following() {
        const { ctx } = this;
        const users = await ctx.model.User.findById(ctx.params.id).populate('following');
        this.success(users.following);
    }
}

module.exports = UserController;
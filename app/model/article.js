module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const ArticleSchema = new Schema({
        title: { type: String, required: true },
        article: { type: String },
        article_html: { type: String },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        views: {
            type: Number, required: false, default: 1
        },
        likes: {
            type:[{type: Schema.Types.ObjectId, ref: 'User'}]
        },
        dislikes: {
            type:[{type: Schema.Types.ObjectId, ref: 'User'}]
        },
        typeImg: { type: String, default: '/js.png' },
        typeTitle: { type: String }
    })
    return mongoose.model('Article', ArticleSchema);
}
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const CommentSchema = new Schema({
        content: { type: String },
        commentId: { type: Schema.Types.ObjectId, ref: 'User'},
        nickName: { type: String }
    })
    return mongoose.model('Comment', CommentSchema);
}
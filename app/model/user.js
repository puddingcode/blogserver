'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    nickName: { type: String },
    password: { type: String },
    email: { type: String },
    avatar: { type: String, required: false, default: '/user.png' },
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    authority: { type: Boolean, default: false },
    idInformation: { type: String },
  });
  return mongoose.model('User', UserSchema);
};

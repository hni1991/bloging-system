var mongoose = require('mongoose');


var postSchema = new mongoose.Schema({
  userId: String,
    title: String,
    content: String,
    category: Object,
    picture:String,
    description: String,
    date:Date,
    isVerified: { type: Boolean, default: false },
    read: Number,
    active: { type: Boolean, default: true },
  });

module.exports = mongoose.model('postsFromUser' , postSchema);

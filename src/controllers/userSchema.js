var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    gender:String,
    email: { type: String, unique: true },
    phoneNumber:Number,
    secQuest:Number,
    secAnwser:String,
    isVerified: { type: Boolean, default: false },
    active:{type:Boolean,default:true},
    user:{ type: String, default: 'user' },
    blogname:String,
    photo: String
    // passwordResetToken: String,
    // passwordResetExpires: Date,
    
  });

module.exports = mongoose.model('user' , userSchema);

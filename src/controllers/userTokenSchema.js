var mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 2000}
});
module.exports = mongoose.model('token' , tokenSchema);

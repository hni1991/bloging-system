var mongoose = require('mongoose');


var categorySchema = new mongoose.Schema({
    category: {type:String,unique:true,lowercase:true,trim:true},
   
  });

module.exports = mongoose.model('categories' , categorySchema);

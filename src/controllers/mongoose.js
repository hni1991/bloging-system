const mongoose = require('mongoose');
const mongoURI = require('./mongoURI');
//const dburl = 'mongodb://localhost:27017';
const dbName = 'Webblog';
let mongoPath = mongoURI + '/' + dbName;

const connectDb = async () =>{
    try{
        console.log('about to connect to database');
        await mongoose.connect(mongoPath);
        console.log('connected to database');

    }catch(err){
        next(err);
    }
}
module.exports = connectDb;

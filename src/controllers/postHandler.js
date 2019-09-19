
var mongoose = require('mongoose');
var crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;
var found = false;
const post = require('./postSchema');
const category = require('./categorySchema');
let catArray = ['history', 'Technology', 'politics' , 'Geography' , '`physiology'];
//const dburl = 'mongodb+srv://ali:ali123@cluster0-mcnq9.mongodb.net/test?retryWrites=true';
const mongoURI = require('./mongoURI');
//const dburl = 'mongodb://localhost:27017';
 const dbName = 'Webblog';
let mongoPath = mongoURI + '/' + dbName;
categoryFinder();
function categoryFinder() {
    //mongoose.connect('mongodb://localhost:27017/Webblog', { useNewUrlParser: true });
    // mongoURI = 'mongodb://localhost:27017/Webblog'
    // var conn = mongoose.connection;
    
    const conn = mongoose.createConnection(mongoPath);
    conn.on('open', function () {
        conn.db.listCollections().toArray(function (err, collectionNames) {
            if (err) {
                conn.close();
                return;
            }
            collectionNames.forEach(item => {
                if (item.name == 'categories') {  found = true; return; }

            });
            /// category not found make it
            conn.close();
            if (!found) {
                categoryMaker((message) => {
                });
            }
            return;
        });
    });
}
function categoryMaker(callbackFunction) {
    catArray.forEach(item => {
        // var conn = mongoose.connection;
            newCategory = new category({ category: item });
            newCategory.save(function (err) {
                if (err) { callbackFunction({ status: err.message });  conn.close(); return false; }
                callbackFunction('item inserted in category');

            });
        
    });
}
var counter ;
function postRead(userId, sort, callback) {
   let   sortString
        if (sort === 'read') {
            sortString = { 'read': -1 }

        } else {
            sortString = { 'date': -1 }
        }
        if (userId) {
            queryString = { userId: userId, isVerified: true ,active: true};
        }else queryString = { isVerified: true, active: true }
        post.find(queryString).sort(sortString).exec(function (err, result) {
            if (err) { callback(err); }


            asyncForEach(result)
            async function asyncForEach(result) {
                for (let i = 0; i < result.length; i++) {

                   
                    let id = result[i].category;
                     category.findOne({ _id: id }, (err, categoryResult) => {
                        if (err) {   return; }
                        result[i].category = categoryResult.category;

                    });
                }

                callback(result);

              }
            
        });

    
}

function addPost(id, title, content, categoryName, read, picture, description, date, isVerified, callbackFunction) {


        category.findOne({ category: categoryName }).exec((err, categoryResult) => {
            newPost = new post({ userId: id, title: title, content: content, category: categoryResult._id, read: read, picture: picture, description: description, date: date, isVerified: isVerified });

            newPost.save(function (err) {
                if (err) { callbackFunction({ status: err.message }); return false; }


            });
        })

  

}






function categoryReader(callback){
    // // closeEmAll();
    // mongoose.connect(mongoPath, { useNewUrlParser: true });
    // var db = mongoose.connection;
    // db.on('error', function () {db.close(); });

    // db.once('open', function (err, resp) {
      
        category.find({}).exec(function (err, result) {
            if (err) {   callback(err); }
                callback(result);
    
    // db.close();
});
}
function AllReader( sort, isVerified, callback){
    let   sortString
        if (sort === 'read') {
            sortString = { 'read': -1 }

        } else if(sort === 'date'){
            sortString = { 'date': -1 }
        }
       
            // queryString = { userId: userId, isVerified: isVerified };
         queryString = { isVerified: isVerified , active:true }
        post.find(queryString).sort(sortString).exec(function (err, postResult) {
            if (err) { callback(err); }
            
            category.find({}).exec(function (err, categoryResult) {
                if (err) { callback(err); }
                    
                    callback({post:postResult,category:categoryResult});
        });
            
            
            
        });

    
}

function deletePost(id, cb){
    console.log('id is '+ id);
    post.updateOne({ _id: id} ,{$set:{active:false}} , function (err, res) {
        if(err){ console.log(err.message); cb('false');return false;}
              
              cb('true');
              return true;
          
  });
}
function okPost(id, cb){
    post.updateOne({ _id: id} ,{$set:{isVerified:true}} , function (err, res) {
        if(err){ console.log(err.message); cb('false');return false;}
              
              cb('true');
              return true;
          
  });
}
function singlePostRead(id, cb){
     queryString = { _id: id };
    id1 = new ObjectId(id);
post.findOne({_id: id}).exec(function (err, result) {
    if (err) { cb(err); }
    else{
let read = result.read + 1;
        post.updateOne({_id:id},{$set:{read:read}} , function(err, res){
            if(err){console.log('there is an error in read + 1'),cb(result)}
            else{
                result.read += 1 ;
                cb(result);
            }
        });
    }
});
}
// post.updateOne({ _id: id} ,{$set:{active:false}} , function (err, res) {

function updatePost(object, cb){
    
    let id = object.id;
    let newtitle = object.title;
    let newcontent = object.content;
    let newdescription = object.description;
    post.updateOne({_id: id},{$set:{title : newtitle , content:newcontent,description:newdescription}},(err,res)=>{
        if(err){cb(err);console.log(err)}
        else{
            cb(res);
        }
    });
}
    module.exports = { addPost, postRead, categoryReader, AllReader, deletePost, okPost, singlePostRead, updatePost};
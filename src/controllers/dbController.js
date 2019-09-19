
var mongoose = require('mongoose');
var crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;

const user = require('./userSchema');
const token = require('./userTokenSchema');
const mongoURI = require('./mongoURI');
const dbName = 'Webblog';

const mongoPath = mongoURI + '/' + dbName ;

function checkUser(useremail, callback) {
        try {
            user.findOne({ email: useremail }, function (err, myuser) {
                callback(myuser);
                });
           
        } catch (error) {
            callback(null);
        }
}

function addUser(firstName, lastName, password, gender, email, phoneNumber, secQuest, secAnswer,userType, blogname, callbackFunction) {


  
        user.findOne({ email: email }, function (err, usr) {
            if (usr) { callbackFunction({ status: 'exists', data: null });  return false; }


            newuser = new user({ email: email, password: password, gender: gender, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, secQuest: secQuest, secAnwser: secAnswer , user: userType, blogname : blogname});
            let hash = bcrypt.hashSync(password, 10);
            newuser.password = hash;
            newuser.save(function (err) {
                if (err) { callbackFunction({ status: err.message, data: null }); return false; }
                var newtoken = new token({ _userId: newuser._id, token: crypto.randomBytes(16).toString('hex') });
                // Save the verification token
                newtoken.save(function (err) {
                    if (err) { callbackFunction({ status: err.message, data: null }); console.log('err in tocken inserting'); return false; }
                    callbackFunction({ status: 'inserted', data: newtoken.token });
                    return true;
                });
            });
        });
    
}
function updateUser(id, firstName, lastName, phoneNumber, blogname,photo, cb) {
    user.updateOne({ _id: id} ,{$set:{firstName:firstName, lastName: lastName, phoneNumber:phoneNumber, blogname: blogname, photo: photo }} , function (err, res) {
        if(err){ console.log(err.message); cb(err);return false;}
            else{cb(res);return true;}
        });

}
function tokenMaker(usr,callbackFunction){
    var newtoken = new token({ _userId: usr._id, token: crypto.randomBytes(16).toString('hex') });
    // Save the verification token
    newtoken.save(function (err) {
        if (err) { callbackFunction({ status: err.message, data: null }); console.log('err in tocken inserting');  return false; }
        callbackFunction({ status: 'inserted', data: newtoken.token });
        return true;
    });
}
function confirmEmail(thisToken, email, callback) {
        token.findOne({ token: thisToken }, function (err, findtoken) {
            if (!findtoken) {
                callback('no-token');
                return false;
            }
            user.findOne({ _id: findtoken._userId, email: email }, function (err, newUsr) {
                if (!newUsr) {
                    callback('expired');
                    return false;
                }
                if (newUsr.isVerified) {
                    callback('verified');
                    return false;
                }
                // Verify and save the user
                newUsr.isVerified = true;
                newUsr.save(function (err) {
                    if (err) { callback(err.message); return false; }
                    callback('ok');
                    return true;
                });

            });
        });
}

function confimEmailChangePass(thisToken, email, callback) {
    mongoose.connect(mongoPath, { useNewUrlParser: true });
        token.findOne({ token: thisToken }, function (err, findtoken) {
            if (!findtoken) {
                callback('no-token');
                return false;
            }
            user.findOne({ _id: findtoken._userId, email: email }, function (err, newUsr) {
                if (!newUsr) {
                    callback('expired');
                    return false;
                }
                if (newUsr.isVerified) {

                    callback('verified');
                    return false;
                }
            });
        });

}

function saveNewPass(newPassword, id, cb){
    
      user.findById(id , (err, newuser) => {
          if(err){console.log(err.message);cb('false') ;return false;}
          let hash = bcrypt.hashSync(newPassword, 10);
       password = hash;
       id= newuser._id;
       user.updateOne({ _id: id} ,{$set:{password:password}} , function (err, newUsr) {
          if(err){ console.log(err.message); cb('false');return false;}
                
                cb('true');
                return true;
            
    });
      });
       
            

}



module.exports = { addUser, confirmEmail, checkUser, tokenMaker, confimEmailChangePass,  saveNewPass, updateUser };
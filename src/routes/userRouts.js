const express = require('express');


// const multer = require('multer');
const multer = require('multer');

const multerStore = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    },
    fileFilter: function (req, file, cb) {

        var filetypes = /jpeg|jpg/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    }
});
const upload = multer({ storage: multerStore });

///////// M U L T E R
const bcrypt = require('bcrypt');
const path = require('path');
// var expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator');
// const assert = require('assert');
const dbCheck = require('../controllers/dbController');
const postHandler = require('../controllers/postHandler');
const router = express.Router();
router.use('/myblog.html', upload.single('newImage', 10));
router.use('/userupdate', upload.single('newphoto', 10));


const mailSender = require('../controllers/emailSender');

// preparing for uploading fotos
router.use(express.urlencoded({ extended: false }));
//router.use(expressValidator);


// support parsing of application/json type post data
router.use(express.json());

var sess;
router.route('/').get((req, res) => {
    res.sendFile(__dirname + '/index.html');
});
router.route('/index').get((req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// router.route('/register').get((req, res) => {
//     res.render('register', { message: '' });
// });
router.route('/register').get((req, res) => {
    res.redirect(__dirname + '/register.html');
})
router.route('/register').post((req, res) => {

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phoneNumber = req.body.phoneNumber;
    let gender = req.body.gender;
    let password = req.body.password;
    let secQuest = req.body.secQuest;
    let secAnwser = req.body.secAnwser;
    let user = 'user';
    let blogname = firstName + lastName;
    if (req.body.blogname) {
        let blogname = req.body.blogname;

    }
    //const errors = validationResult(req);

    let fromEmail = 'test100zargar@gmail.com'

    dbCheck.addUser(firstName, lastName, password, gender, email, phoneNumber, secQuest, secAnwser, user, blogname, (returnValue) => {

        if (returnValue.status == 'inserted') {

            mailSender.sendEmail(email, fromEmail, 'confirmation Email', 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/?tk=' + returnValue.data + '&email=' + email + '.\n');
            res.json({ status: 'done' });

        } else if (returnValue.status == 'exists') {
            res.json({ status: 'exists' });

        } else {
            res.json({ status: 'error' });

        }
    });
});

router.route('/confirmation').get((req, res) => {
    dbCheck.confirmEmail(req.query.tk, req.query.email, (returnValue) => {
        if (returnValue === 'ok') { res.redirect('/register.html'); }
        else { res.redirect('/register.html'); }
    });

    //dbCheck.confirmEmail(token)
});

router.route('/login').post((req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    dbCheck.checkUser(email, (user) => {
       
        if (user && user.isVerified) {
            let comparePasses = bcrypt.compareSync(password, user.password);
            if (comparePasses) {
                req.session.user = {
                    id: user._id,
                    email: user.email,
                    password: user.password,
                    isVerified: user.isVerified,
                    active: user.active,
                    gender: user.gender,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    user:user.user,
                    photo: user.photo,
                    blogname:user.blogname
                };
                if(user.user === 'admin'){
                    res.json({status : 'admin'});
                 }else{
                    res.json({ status: 'ok' })
                 }
                

            } else {
                res.json({ status: 'wrong' });
            }
        } else {
            res.json({ status: 'wrong' });

        }
    });
});
router.route('/user.html').get((req, res) => {
    if (req.session.user) {
        let reqPath = path.join(__dirname, '../../private/user.html');
        res.sendFile(reqPath);
        // res.redirect('/user.html');
    }
    else {
        res.redirect('/register.html')
    }
});
router.route('/user').post((req, res) => {
    sort = 'date';
    if (req.session.user) {
        let userId = req.session.user.id;
        postHandler.postRead(userId, sort, (result) => {
            postHandler.categoryReader((catResult) => {
                res.json({ post: result, person: req.session.user, category:catResult });

            })
        })
    }
    else {
        res.redirect('/login.html');
    }
});
router.route('/forget').post((req, res) => {
    let email = req.body.email;
    dbCheck.checkUser(email, (user) => {
        if (user && user.isVerified) {
            userId = user._id;
            dbCheck.tokenMaker(user, (response) => {

                if (response.status === 'inserted') {
                    // sending an email
                    let fromEmail = 'test100zargar@gmail.com'
                    let email = req.body.email;



                    mailSender.sendEmail(email, fromEmail, 'change password Email', 'Hello,\n\n' + 'Please click here to reset your password: \nhttp:\/\/' + req.headers.host + '\/resetpassword.html\/?tk=' + response.data + '&email=' + email + '&userId=' + userId + '.\n');
                    res.json({ status: 'done' })
                } else {
                    // sending a message as Error occured
                    res.json({ status: 'wrong' });
                }
            });
        } else {

            res.json({ status: 'wrong' });
        }

    });

});
router.route('/resetpassword.html').get((req, res) => {
    dbCheck.confimEmailChangePass(req.query.tk, req.query.email, (returnValue) => {
        if (returnValue !== 'expired') {
            let reqPath = path.join(__dirname, '../../private/resetpassword.html');
            res.sendFile(reqPath);
        }

        else { res.redirect('/register.html'); }
        // res.sendFile(path.join(__dirname,'../../public/resetpassword.html'));
    });
});
router.route('/logout').get((req, res) => {
    req.session.destroy();
    res.redirect('/');
});


router.route('/myblog.html').post((req, res) => {
    let user = req.session.user;
    let userId = user.id;
    let title = req.body.newTitle;
    let content = req.body.newContent;
    let category = req.body.newCategory;
    if(category==='select category ...'){
        category='others';
    }
    var file = '';
    if (req.file) {
        file = req.file.filename;
    }
    let read = 0;
    let description = 'some description';
    let date = Date.now();
    let isVerified = false;
    postHandler.addPost(userId, title, content, category, read, file, description, date, isVerified, (data) => {
    });

    res.redirect('/user.html');
});
router.route('/test').get((req, res) => {
    let reqPath = path.join(__dirname, '../../public/test.html');
    res.sendFile(reqPath);
});
router.route('/confirmChangePass.html').get((req, res) => {
    res.send('here is confirm pass page');
});
router.route('/confirmChangePass').post((req, res) => {
    let pass = req.body.newpassword;
    // let email = req.body.email;
    let id = req.body.search;
    id = id.split('userId=');
    id = id[1];
    dbCheck.saveNewPass(pass, id, (newUsr) => {
        let reqPath = path.join(__dirname, '../../public/register.html');
        res.json({ status: 'true' });

    });



    //res.sendFile(__dirname + '../../public/register.html');
});
router.route('/test').post((req, res) => {
    let userId = req.session.user.id;
    let sort = 'date';
    let category;
    postHandler.AllReader(userId, sort, result => {
        res.json({ result: result, user: req.session.user });
    });
    

});
router.route('/index.html').get((req, res) => {
    let reqPath = path.join(__dirname, '../../public/index.html');
    res.sendFile(reqPath);
});
router.route('/index').post((req, res) => {

    postHandler.AllReader('date', true, postDateSorted => {
        postHandler.AllReader('read', true, postReadSorted => {

            let response = { postDateSorted: postDateSorted, postReadSorted: postReadSorted }
            res.json(response);
        });
    });
});
router.route('/admin.html').get((req, res) => {
    let user = req.session.user;

    if (user.user == 'admin') {
    let reqPath = path.join(__dirname, '../../private/admin.html');
    res.sendFile(reqPath);
    //let reqPath = path.join(__dirname, '../../private/user.html');
       // res.sendFile(reqPath);
    }else {
        req.session.destroy();

        res.redirect('/register.html');
    }
});
router.route('/admin').post((req, res) => {

        postHandler.AllReader( 'date', false, postDateSorted => {
            postHandler.AllReader( 'read', false, postReadSorted => {
                let response = { postDateSorted: postDateSorted, postReadSorted: postReadSorted, posuser: req.session.user }
                res.json(response);
            });
        });
});
router.route('/delet').post((req, res) => {
    let id = req.body.id;
    console.log(req.body);
    postHandler.deletePost(id, (result) => {
        if(result){
            res.json('deleted');

        }else{
            res.json('Error');
        }
    })
});
router.route('/ok').post((req, res) => {
   
    let id = req.body.id;
    postHandler.okPost(id, (result) => {
       
        if(result){
            res.json('ok');

        }else{
            res.json('Error');

        }
    })
});
router.route('/singlepage.html/:id').get((req, res) => {
    req.session.idPost = req.params.id;
    let reqPath = path.join(__dirname, '../../public/singlePage.html');
    res.sendFile(reqPath); 
});
router.route('/singlePage').post((req, res) => {
    postHandler.singlePostRead(req.session.idPost, (result) => {
        res.json(result);
    })
});
router.route('/update').post((req, res) => {
    let object = req.body;
    postHandler.updatePost(req.body, (result) => {
        res.json(result);
    });
    
});
router.route('/userupdate').post((req, res) => {
    let firstName = req.body.newFirtname;
    let lastName = req.body.newLastname;
    let phoneNumber = req.body.newPhonenumber;
    let blogname = req.body.newBlogname;
    let id = req.session.user.id;
    let photo =req.session.user.photo;
    if (req.file) {
        photo = req.file.filename;
    }
    
    dbCheck.updateUser(id, firstName, lastName, phoneNumber, blogname, photo, ( result)=>{
            req.session.user.firstName = firstName;
            req.session.user.lastName = lastName;
            req.session.user.phoneNumber = phoneNumber;
            req.session.user.blogname = blogname;
            req.session.user.photo = photo;
        // }
        res.redirect('/user.html');
        
    })
})

module.exports = router;
// export {router};

const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const connectDb = require('./src/controllers/mongoose');
// preparing for uploading fotos
// app.use(express.urlencoded({ extended: false }));
//  //router.use(expressValidator);


// // support parsing of application/json type post data
// app.use(express.json());
app.use(session({secret:'mysecret'}));
// app.set('view engine','ejs');
// app.set('views', path.join(__dirname, '/src/views'));
const userRout = require('./src/routes/userRouts');
//import {router} from './src/routes/mainRoutes.js' ;
//const adminRout = require('./src/routes/adminRouts');

const port = process.env.PORT || 4000;
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/admin',adminRout);
app.use('/',userRout);
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});
connectDb();
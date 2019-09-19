var nodemailer=require('nodemailer');
var transporter = nodemailer.createTransport(
    {
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user:'test100zargar@gmail.com',
        // pass:'TEST123/'
    //    user: 'mojtabazargar1000@gmail.com',
       pass:'mojtaba1000'
    }}
);
exports.sendEmail=function (to1,from1,subject1,text1) {
    var emailOption={
        from:from1,
        to:to1,
        subject:subject1,
        text:text1
    }
    transporter.sendMail(emailOption,(err,info)=>{
        if(err){
            return false;
        }else{
            return true;

        }
    })
  }
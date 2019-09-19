const express = require('express');
const app = express();
const path = require('path')

port = process.env.PORT || 3000
app.use(express.static('public'))

app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.get('/register',(req,res)=>{
   
   res.sendFile(path.join(__dirname+'/register.html'))
}).post('/register',(req,res)=>{
  //  res.sendFile(path.join(__dirname+'/register.html'))
   // let name = .fistName
   console.log(req.body)
    res.json({status : 'done'})
})
app.post('/login',(req,res)=>{
    //  res.sendFile(path.join(__dirname+'/register.html'))
     // let name = .fistName
     console.log(JSON.stringify(req.body))
     setTimeout(()=>{
        res.json({status : 'wrong'})

     },500)
  })

  app.post('/forget',(req,res)=>{
   //  res.sendFile(path.join(__dirname+'/register.html'))
    // let name = .fistName
    console.log(req.body)
    setTimeout(()=>{
       res.json({status : 'done'})

    },500)
 })

  app.get('/user',(req,res)=>{
res.sendFile(path.join(__dirname+'/User.html'))
  });
  app.post('/user',(req,res)=>{
     let person={
        permision:"user",
      firstName: "Hossein",
      lastName: "Niko",
      email: "Hoseinnikoo@gmail.com",
      blogName:"",
      phoneNumber: "+49-1639741048",
      gender: "Male",
     picture:""
     }
     let post=[
        {
         titel:'whats New',
         content:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores asperiores minus quibusdam culpa autem nam incidunt dolor! Dolores quae reprehenderit odio labore omnis incidunt corporis, sequi tempore minima nulla et.',
         ctegory:'tech',
         picture:'',
         description:'some thing new',
         date:'25,Jun,2019'
     },
     {
      titel:'whats New 1',
      content:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores asperiores minus quibusdam culpa autem nam incidunt dolor! Dolores quae reprehenderit odio labore omnis incidunt corporis, sequi tempore minima nulla et.',
      ctegory:'tech',
      picture:'',
      description:'some thing new',
      date:'25,Jun,2019'

  }
   ]
     let response={person,post}
res.json({response:response})
console.log(response)
  })
app.listen(port,()=>{
    console.log(`app is run on port : ${port}`)
})
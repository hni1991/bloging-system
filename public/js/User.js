var myurl = 'http://'+window.location.host;

var data1;
var selectobj;
// var url='http://192.168.0.122:4000'

window.onload = ()=>{
   sendData(myurl+'/user',{'page':"userpage"}).then((data)=>{
     console.log(data);
      postCreate(data);
      userCreate(data);
      catehCreate(data);
      data1=data;
      })
}




function showform() { 
   $('#hideForm').removeClass('d-none');
};

function sendBlogform() { 
    $('#hideForm').addClass('d-none');
   
 };
 function cancelnew() { 
    $('#hideForm').addClass('d-none');
 };
 function sendData(url,data){
   console.log(data);
   return fetch(url,{
    method:'POST'  ,//GET,PUT,DELETE,etc
    mode:'cors', //no=cors, same-origin
    cache:'no-cache',
    credentials:'same-origin', //
    headers:{
     'Content-Type': 'application/json'
      //if method is GET use 'application/X-www-form-urlencoded'
    },
    redirect:'follow', //manual , error 
    referrer:'no-referrer', //client
     body:JSON.stringify(data)
  }
  ).then((response)=>{
    console.log(response)
   return response.json();
  }) 
 }


 function edit(param){
    let El = document.getElementById(param);
    let newEl = document.createElement('input')
    newEl.value = El.innerHTML
    El.parentNode.replaceChild(newEl,El)
    let buttencansel = document.createElement('button')
    buttencansel.innerHTML = 'cancel'
    newEl.parentNode.appendChild(buttencansel)
 }


 function closeE(){
   let edit = document.getElementById('editor')
   let edit1 = document.getElementById('editorP')

   edit.style.visibility="hidden";
   edit1.style.visibility="hidden";
}




function postCreate(param) {
   let postcard = document.getElementById('postShow');
   postcard.innerHTML=''

   for (let i = 0; i < param.post.length; i++) {
     console.log(param.post[i])
     let id =JSON.stringify(param.post[i]._id) 
     let post111 = JSON.stringify("post") 
     console.log(id)
     postcard.innerHTML += "<div class='card'><span class='Btn' onclick='openE("+post111+","+id+")'><i class='fa fa-pencil-alt'></i></span><div class='fakeimg' style='height:200px;'><img  src='./uploads/" + param.post[i].picture + "'></div><h2>" + param.post[i].title + "</h2><h5>" + param.post[i].description + " , " + param.post[i].date + "</h5><p>" + param.post[i].content + "</p> <p > this post "+param.post[i].read+" time viewed</p></div>"
   }
}



function userCreate(param) {
   let blogtitel = document.getElementById('blogname')
   let userCard = document.getElementById('userInform')
   if (param.person.blogname !== '') {
     console.log(param.person.blogname)
     blogtitel.innerHTML = param.person.blogname
   } else {
     blogtitel.innerHTML = 'New Blog'
   }

  let person111 = JSON.stringify('person')
  let id = JSON.stringify(param.person.id)

 console.log(param.person)
 userCard.innerHTML=''
   userCard.innerHTML += '<div class="card"> <h2>' + param.person.firstName + ' ' + param.person.lastName + '</h2><span class="Btn" onclick="openE2()"><i class="fa fa-pencil-alt"></i></span><div class="fakeimg1 text-center" style="height:220px;"><img class="col-lg-12 col-md-12 col-sm-6 col-6" src="/uploads/' + param.person.photo + '" alt=""/></div><br><p>' + param.person.email + ' </p><br><p>' + param.person.phoneNumber + ' </p><br><p>' + param.person.gender + ' </p></div></div>'
 }

 catehCreate=(param)=>{
   let categselect = document.getElementById('formcateg');
   categselect.innerHTML+='<option>select category ...</option>'
   for(i=0 ; i<param.category.length ;i++){
    categselect.innerHTML+='<option>'+param.category[i].category+'</option>'
   }
 }


 function openE(x,y){
  let result;
  for(i=0 ;i<data1.post.length ;i++){
    if(data1.post[i]._id == y){
     result = data1.post[i]
     console.log(result)
    }
  }
  selectobj = result;


  let edit = document.getElementById('editor')
    if(x === "post"){
     edit.style.visibility="visible";
     editpage(result)

   }
  
}
function openE2() {
  let edit1 = document.getElementById('editorP')
  edit1.style.visibility="visible";
  editUser(data1.person)
  
}

function editpage(param){
  let editPage1 = document.getElementById('editor');
  editPage1.innerHTML="<div class='card col-6 center '><span class='Btn' onclick='closeE()'><i class='fa fa-times'></i></span><input type='text'id='titleofedit' value='"+param.title+"'><br><input type='input'id='descriptionofedit' value='"+param.description+"'><br><textarea name='' id='contentofedit' > "+param.content+"</textarea><span class='Btn1' onclick='checkedit()'><i id='doneBtn' class='fa fa-check'></i></span><span class='Btn2' onclick='deletobj()'><i id='trashBtn' class='fa fa-trash-alt'></i></span></div>" 
}
function editUser(param){
  console.log('opene2edit')
  let editUser1 = document.getElementById('editorP');
  editUser1.innerHTML = "<form action='/userupdate' method='POST' enctype='multipart/form-data' id='usereditform'><div class='card col-6 center '><span class='Btn' onclick='closeE()'><i class='fa fa-times'></i></span><input name='newFirtname' type='text'value='"+param.firstName+"'><br><input name='newLastname' type='text'value='"+param.lastName+"'><br><input name='newPhonenumber' type='input' value='"+param.phoneNumber+"'><br><input name='newphoto' type='file' placeholder='New Photo'><br><input name='newBlogname' type='input' value='"+param.Blogname+"'><span class='Btn1' onclick='sendformedit()'><i id='uploadBtn' class='fa fa-upload'></i></span></div></form>";
}



function checkedit(){
  let title = document.getElementById('titleofedit')
  let description = document.getElementById('descriptionofedit')
  let content = document.getElementById('contentofedit')
  let editobject={
    id:selectobj._id,
    title:title.value,
    description:description.value,
    content:content.value 
  };
closeE();
  sendData(myurl+'/update',editobject).then((data)=>{
    reData();

    })
console.log('selectedObj id is '+ selectobj._id);
}
function deletobj(){
  closeE();
  sendData(myurl+'/delet',{'id':selectobj._id}).then((data)=>{
   reData();
    })
}

function sendformedit(){
  let form1 = document.getElementById('usereditform');
  form1.submit()
}

function reData(){
  sendData(myurl+'/user',{'page':"userpage"}).then((data)=>{
    console.log(data);
     postCreate(data);
     userCreate(data);
     data1=data;
     })
}
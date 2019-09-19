var myurl = window.location.host;



window.onload = ()=>{
    sendData(myurl+'/admin',{'page':"adminPage"}).then((data)=>{
      console.log(data)
      postCreate(data)
       })
 }

 var myurl = 'http://'+window.location.host;


 function sendData(url,data){
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
    return response.json();
   }) 
  }
 
  function acceptP(param,x){
    deletobj(x)

    console.log(" accept object"+param)
    sendData(myurl+'/ok',{id:param}).then((data)=>{
      if(data){
        console.log(data)
      }
            })
  }
  function deletP(param,x){
    deletobj(x)

    console.log(" delet object :"+param)
    sendData(myurl+'/delet',{id:param}).then((data)=>{
        if(data){
          console.log(data)
        }
        })
  }

  function postCreate(param){
    console.log(param)
    let object = param.postDateSorted
      let card = document.getElementById('Recholder');
      for(i=0 ; i<object.post.length;i++){
        let id = JSON.stringify(object.post[i]._id) 
        let elementid = JSON.stringify("element"+i+1);
        card.innerHTML+="<div class='row' id='"+elementid+"' ><div class='col-sm-6 col-md-4'><div class='fakeimg'><img style='height: 235px;'class='img-fluid' src='/uploads/"+object.post[i].picture+"' alt=''></div><br><div class='d-flex justify-content-center'><a href='#' onclick='acceptP("+id+","+elementid+")' style='width: 106px;margin-right: 10px;' class='btn btn-success btn-lg'><span class='glyphicon glyphicon-ok'></span> Ok </a><a href='#' onclick='deletP("+id+","+elementid+")' class='btn btn-danger btn-lg'><span class='glyphicon glyphicon-trash'></span> Delete </a></div></div><div class='col-sm-6 col-md-8'><h2>"+object.post[i].title+"</h2><span>"+object.post[i].date+" , "+object.post[i].description+"</span><p>"+object.post[i].content+"</p></div></div><hr>"
      }
  }

  function deletobj(x){
    console.log(x+" justdelet")
    let elid = JSON.stringify(x)
    let el1 = document.getElementById(elid)
    el1.classList.add("d-none");
  }

  
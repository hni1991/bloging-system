var myurl = 'http://'+window.location.host;

function checkpassword(){

var resPass1 = document.getElementById('resPassword');
var resPass2 = document.getElementById('resPassword2');

      if(resPass1.value===resPass2.value){
        let obj = {
          newpassword:resPass1.value,
          search:window.location.search
        }
        // console.log('id is ' + obj.id);
         sendData(myurl+'/confirmChangePass',obj).then((data)=>{
        // Recentpost(data);
        // Mostpost(data);
        console.log(data);
        console.log(data.status);
        if(data.status === 'true'){
          window.location.href='/register.html';
        }else{

        }
      });
      }else{
          alert('check your password')
      }
  };


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



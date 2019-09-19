var myurl = 'http://'+window.location.host;


window.onload = ()=>{
    sendData(myurl+'/singlePage',{Routs:'singlepage'}).then((data)=>{
    console.log(data);
    creatorCard(data)
       
      })
}

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
     console.log('data');
     console.log(data)
    return response.json();
   }) 
  }
  function creatorCard(param){
    console.log('uploads/'+param.picture)
      let card = document.getElementById('cardsingle');
      card.innerHTML+='<div class="col-lg-12 col-sm-12 col-md-12"><h2>'+param.title+'</h2><span>'+param.date+'</span><div><img class="img-fluid" src="/uploads/'+param.picture+'" alt=""></div><br><p>'+param.content+'</p><p > this post '+param.read+' time viewed</p></div>'
  }
  
                        
                        
                        
                       

                      

var myurl = 'http://' + window.location.host;
window.onload = () => {
  sendData(myurl + '/index', { Routs: 'indexpage' }).then((data) => {
    console.log('data again');

    Recentpost(data);
    Mostpost(data);
  })
}
function sendData(url, data) {

  return fetch(url, {
    method: 'POST',//GET,PUT,DELETE,etc
    mode: 'cors', //no=cors, same-origin
    cache: 'no-cache',
    credentials: 'same-origin', //
    headers: {
      'Content-Type': 'application/json'
      //if method is GET use 'application/X-www-form-urlencoded'
    },
    redirect: 'follow', //manual , error 
    referrer: 'no-referrer', //client
    body: JSON.stringify(data)
  }
  ).then((response) => {

    return response.json();
  })
}
function Recentpost(param) {
  console.log('data again');
  console.log(param);
  let rec = document.getElementById('Recholder');
  console.log('Creator is run')
  let res = param.postDateSorted.post;
  for (let i = 0; i < res.length; i++) {
    let id = JSON.stringify(res[i]._id)
    rec.innerHTML += " <div onclick='singelpost(" + id + ")' class='col-sm-6 col-md-4'><div class='fakeimg'><img style='height: 235px;width: 400px;' class='img-fluid' src='uploads/" + res[i].picture + "' alt=''></div><h2>" + res[i].title + "</h2><span>" + res[i].date + "</span><p class='pCss'>" + res[i].content + "</p><p > this post " + res[i].read + " time viewed</p><hr class='d-sm-none'></div>"

  }
}

function Mostpost(param) {
  let res = param.postReadSorted.post;

  let rec = document.getElementById('Mostholder');
  console.log('Creator is run 2')
  for (let i = 0; i < res.length; i++) {
    let id = JSON.stringify(res[i]._id)
    rec.innerHTML += " <div onclick='singelpost(" + id + ")' class='col-lg-6 col-sm-12 col-md-6'><div class='fakeimg'><img style='height: 235px;width: 400px;' class='img-fluid' src='uploads/" + res[i].picture + "' alt=''></div><h2>" + res[i].title + "</h2><span>" + res[i].date + "</span><p class='pCss'>" + res[i].content + "</p><p > this post " + res[i].read + " time viewed</p><hr class='d-sm-none'></div>"

  }
}

function singelpost(param) {
  console.log('single post id :' + param);
  window.location.href = 'singlePage.html/' + param + ''


}




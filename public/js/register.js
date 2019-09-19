var myurl = "http://" + window.location.host;
window.onload = function() {
  subRegisterR();
  subRegisterL();
  subRegisterF();
};

function redA(param, color) {
  let box = document.getElementById("messageBox");
  box.style.visibility = "visible";
  box.style.color = color;
  box.innerHTML = param;
}
function redAL(param, color) {
  let box = document.getElementById("messageBox1");
  box.style.visibility = "visible";
  box.style.color = color;
  box.innerHTML = param;
}

//register form check and send function
function subRegisterR() {
  let butt = document.getElementById("regBtn");
  butt.onclick = function() {
    checkerR(cb => {
      if (cb) {
        sendDataR();
      } else {
      }
    });
  };
}

// login page check and send
function subRegisterL() {
  let butt = document.getElementById("logBtn");
  butt.onclick = function() {
    checkerL(cb => {
      if (cb) {
        sendDataL();
      } else {
        console.log("didnt work");
      }
    });
  };
}

//forget page check
function subRegisterF() {
  let butt = document.getElementById("forgetBtn");
  butt.onclick = function() {
    checkerF(cb => {
      if (cb) {
        sendDataF();
      } else {
        console.log("didnt work");
      }
    });
  };
}
//login form checker
function checkerL(cb) {
  let email = document.forms["loginForm"]["email"].value;
  let pass = document.forms["loginForm"]["password"].value;

  if (email === "") {
    redAL("Please write Your E-Mail address", "red");
    cb(false);
  } else {
    if (pass === "") {
      redAL("Please write Your Password", "red");
      cb(false);
    } else {
      console.log("pas is right");
      redAL("Please Waite . . .", "green");
      cb(true);
    }
  }
}

//register form checker
function checkerR(cb) {
  let repass = document.getElementById("passR").value;
  let fname = document.forms["registerform"]["firstName"].value;
  let lname = document.forms["registerform"]["firstName"].value;
  let email = document.forms["registerform"]["email"].value;
  let phone = document.forms["registerform"]["phone"].value;
  let gender = document.forms["registerform"]["gender"].value;
  let password = document.forms["registerform"]["password"].value;
  let secQuest = document.forms["registerform"]["secQuest"].value;
  let secAnwser = document.forms["registerform"]["secAnwser"].value;
  let securereq = document.forms["registerform"]["g-recaptcha-response"].value;

  if (fname === "") {
    cb(false);
    redA(" please write your first name ", "red");
    //cb(true)
  } else {
    if (lname === "") {
      cb(false);
      redA(" please write your last name  ", "red");
    } else {
      if (lname === "") {
        cb(false);
        redA(" please write your last name  ", "red");
      } else {
        if (email === "") {
          cb(false);
          redA(" please write your E-Mail adress  ", "red");
        } else {
          if (phone === "") {
            cb(false);
            redA(" please write your Phone-Number  ", "red");
          } else {
            if (password === "") {
              cb(false);
              redA(" please write your password  ", "red");
            } else {
              if (password != repass) {
                cb(false);
                redA(
                  " control you password and confrim-pass and try again ",
                  "red"
                );
              } else {
                if (secQuest === "") {
                  cb(false);
                  redA(" please select a security question ", "red");
                } else {
                  if (secAnwser === "") {
                    cb(false);
                    redA(" please write your answer ", "red");
                  } else {
                    if (securereq === "") {
                      cb(false);
                      redA(" check i am not a robot ", "red");
                    } else {
                      cb(true);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

//checker forget  22222
function checkerF(cb) {
  let email = document.forms["forgetForm"]["email"].value;

  if (email === "") {
    redAL("Please write Your E-Mail address", "red");
    cb(false);
  } else {
    redAL("Please Waite . . .", "green");
    cb(true);
  }
}
//login form sender
function sendDataL() {
  let email = document.forms["loginForm"]["email"].value;
  let pass = document.forms["loginForm"]["password"].value;
  let myobj = {
    email: email,
    password: pass
  };
  sendData(myurl + "/login", myobj).then(data => {
    console.log(data);
    if (data.status == "wrong") {
      redAL("Please check your E-Mail and Password and try again !", "red");
    }
    if (data.status == "ok") {
      window.location.href = "user.html";
    }
    if (data.status == "admin") {
      window.location.href = "admin.html";
    }
  });
}
function sendDataF() {
  let email = document.forms["forgetForm"]["email"].value;
  let myobj = {
    email: email
  };
  console.log("email to send is " + myobj.email);
  sendData(myurl + "/forget", myobj).then(data => {
    console.log(data);
    if (data.status == "wrong") {
      redAL("Please check your E-Mail and Password and try again !", "red");
    }
    if (data.status == "done") {
      console.log("status is done in client");

      redAL(
        "We send you a E-Mail , use the link and chenge your password !",
        "green"
      );
    }
  });
}
// register form sender
function sendDataR() {
  let fname = document.forms["registerform"]["firstName"].value;
  let lname = document.forms["registerform"]["lastName"].value;
  let email = document.forms["registerform"]["email"].value;
  let phone = document.forms["registerform"]["phone"].value;
  let gender = document.forms["registerform"]["gender"].value;
  let password = document.forms["registerform"]["password"].value;
  let secQuest = document.forms["registerform"]["secQuest"].value;
  let secAnwser = document.forms["registerform"]["secAnwser"].value;
  let securereq = document.forms["registerform"]["g-recaptcha-response"].value;
  let myobj = {
    firstName: fname,
    lastName: lname,
    email: email,
    phoneNumber: phone,
    gender: gender,
    password: password,
    secQuest: secQuest,
    secAnwser: secAnwser
  };
  sendData(myurl + "/register", myobj).then(data => {
    if (data.status == "done") {
      redA(
        "Your accaount is createt please check your email and confrim your account",
        "green"
      );
    }
    if (data.status == "exists") {
      redA(
        "This Email is registered. please login or try another Email",
        "red"
      );
    }
    if (data.status == "error") {
      redA(
        "In this time we can not manage your request please try later",
        "red"
      );
    }
  });
}

//fetch
function sendData(url, data) {
  console.log(url);
  return fetch(url, {
    method: "POST", //GET,PUT,DELETE,etc
    mode: "cors", //no=cors, same-origin
    cache: "no-cache",
    credentials: "same-origin", //
    headers: {
      "Content-Type": "application/json"
      //if method is GET use 'application/X-www-form-urlencoded'
    },
    redirect: "follow", //manual , error
    referrer: "no-referrer", //client
    body: JSON.stringify(data)
  }).then(response => {
    return response.json();
  });
}

//register form recap function
var onloadCallback = function() {
  grecaptcha.render("html_element", {
    sitekey: "6Lc6DKoUAAAAAFk8LCZknHs2fuqbIGiVqRKAjl-W"
  });
};

//show and hidden forget form
function showForgetform() {
  $("#LF").addClass("d-none");
  $(".forgetForm").removeClass("d-none");
}

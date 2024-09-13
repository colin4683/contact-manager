const urlBase = 'http://contacts.hunterdobb.xyz/smallprojectapi';
// const urlBase = 'http://127.0.0.1:5500/smallprojectapi';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  // Get the email and password from index.html
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  // Used for displaying error messages
  document.getElementById("loginResult").innerHTML = "test";

  // Turns login info into a JSON string to be exported
  let tmp = {email: email,password: password};
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/login.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.first_name;
        lastName = jsonObject.last_name;

        document.getElementById("loginResult").innerHTML = "Success";

        saveCookie();

        window.location.href = "contacts.html";
      }
    };

    xhr.send(jsonPayload);
  } catch (error) {
    document.getElementById("loginResult").innerHTML = error.message;
  }
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
  document.getElementById("loginResult").innerHTML = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	for (var i = 0; i < splits.length; i++)  {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		} else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		} else if (tokens[0] == "userId") {
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 ) {
		window.location.href = "index.html";
	} else {
		document.getElementById("loggedInName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doRegister() {

  // Get the name, email, and password from register.html
  let firstName = document.getElementById("registerFirstName").value;
  let lastName = document.getElementById("registerLastName").value;
  let email = document.getElementById("registerEmail").value;
  let password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "test";

	let tmp = {first_name:firstName,last_name:lastName,email:email,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/registration.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				// document.getElementById("registerResult").innerHTML = "Successs";
        // document.getElementById("loginResult").innerHTML = xhr.responseText;

        // let jsonObject = JSON.parse(xhr.responseText);
        // userId = jsonObject.id;

        // firstName = jsonObject.first_name;
        // lastName = jsonObject.last_name;

        // document.getElementById("registerResult").innerHTML = "Successs";

        // saveCookie();

        window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	} catch(err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
	
}

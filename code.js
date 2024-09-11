const urlBase = 'http://test.hunterdobb.xyz/smallprojectapi';
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
  let tmp = { login: email, password: password };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/login.' + extension;


  // ----- Yet to be implemented: -----
  // let xhr = new XMLHttpRequest();
  // xhr.open("POST", url, true);
  // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  // try {
  //   xhr.onreadystatechange = function() {
  //     if (this.readyState == 4 && this.status == 200) {
  //       let jsonObject = JSON.parse(xhr.responseText);
  //       userId = jsonObject.id;

  //       if (userId < 1) {
  //         document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
  //         return;
  //       }

  //       firstName = jsonObject.firstName;
  //       lastName = jsonObject.lastName;

  //       saveCookie();

  //       window.location.href = "contacts.html";
  //     }
  //   };

  //   xhr.send(jsonPayload);
  // } catch (error) {
  //   document.getElementById("loginResult").innerHTML = error.message;
  // }
}
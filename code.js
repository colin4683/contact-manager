const urlBase = 'http://contacts.hunterdobb.xyz/smallprojectapi';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let email = ""

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  // Get the email and password from index.html
  email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  // Turns login info into a JSON string to be exported
  let tmp = { email: email, password: password };
  let jsonPayload = JSON.stringify(tmp);

  // References login.php file
  let url = urlBase + '/login.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML = "Invalid Login";
          return;
        }

        firstName = jsonObject.first_name;
        lastName = jsonObject.last_name;

        saveCookie();

        window.location.href = "contacts.html";
      }
    };

    xhr.send(jsonPayload);
  } catch (error) {
    document.getElementById("loginResult").innerHTML = error.message;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; lastName= ; userID = ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",email=" + email + ";expires=" + date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");

  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");

    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    } else if (tokens[0] == "email") {
      email = tokens[1];
    }
  }

  if (userId < 0) {
    //window.location.href = "index.html";
  } else {
    document.getElementById("loggedInName").innerHTML = "Logged in as " + firstName + " " + lastName + ": " + email;
  }
}

function searchContacts() {
  let search = document.getElementById("searchText").value;

  let contactList = "";

  let tmp = { search: search, owner: userId };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/search.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);

        if (jsonObject.results.length == 0) {
          document.getElementById("contactSearchResult").innerHTML = "No Contacts Found";
        } else {
          document.getElementById("contactSearchResult").innerHTML = "";
          // document.getElementById("contactSearchResult").innerHTML = xhr.responseText;
        }

        for (let i = 0; i < jsonObject.results.length; i++) {
          let result = jsonObject.results[i];
          let foundContact = result["id"] + " " + result["first_name"] + " " + result["last_name"] + ": " + result["phone_number"] + " | " + result["email"];
          contactList += foundContact;
          if (i < jsonObject.results.length - 1) {
            contactList += "<br />\r\n";
          }
        }

        document.getElementById("contactList").innerHTML = contactList;
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}

function addContact() {
  let newContactFirstName = document.getElementById("newContactFirstName").value;
  let newContactLastName = document.getElementById("newContactLastName").value;
  let newContactEmail = document.getElementById("newContactEmail").value;
  let newContactPhoneNumber = document.getElementById("newContactPhoneNumber").value;

  document.getElementById("addContactResult").innerHTML = "";

  let tmp = { owner: userId, first_name: newContactFirstName, last_name: newContactLastName, email: newContactEmail, phone_number: newContactPhoneNumber };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/addContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("addContactResult").innerHTML = "Contact has been added";
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("addContactResult").innerHTML = err.message;
  }
}

function updateContact() {
  let existingContactID = document.getElementById("existingContactID").value;
  let updatedContactFirstName = document.getElementById("updatedContactFirstName").value;
  let updatedContactLastName = document.getElementById("exisitngContactLastName").value;
  let updatedContactEmail = document.getElementById("updatedContactEmail").value;
  let updatedContactPhoneNumber = document.getElementById("updatedContactPhoneNumber").value;

  document.getElementById("updateContactResult").innerHTML = "";

  let tmp = { owner: userId, id: existingContactID, first_name: updatedContactFirstName, last_name: updatedContactLastName, email: updatedContactEmail, phone_number: updatedContactPhoneNumber };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/updateContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("updateContactResult").innerHTML = "Contact has been updated";
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("updateContactResult").innerHTML = err.message;
  }
}


function doRegister() {

  // Get the name, email, and password from register.html
  firstName = document.getElementById("registerFirstName").value;
  lastName = document.getElementById("registerLastName").value;
  email = document.getElementById("registerEmail").value;
  let password = document.getElementById("registerPassword").value;

  let tmp = { first_name: firstName, last_name: lastName, email: email, password: password };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/registration.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        saveCookie();
        window.location.href = "contacts.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("registerResult").innerHTML = err.message;
  }

}

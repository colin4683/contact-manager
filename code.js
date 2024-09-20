const urlBase = 'http://contacts.hunterdobb.xyz/smallprojectapi';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let email = "";
let selectedContact = "";
let currentSearchResults = "";

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

function deleteContact() {
  // let selectedContactID = document.getElementById("deleteContactID").value;
  let selectedContactID = selectedContact["id"];

  // document.getElementById("deleteContactResult").innerHTML = "";

  let tmp = { id: selectedContactID };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/deleteContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // document.getElementById("deleteContactResult").innerHTML = "Contact has been deleted";
        searchContacts(function() {
          selectedContact = "";
          selectFirstContactOrShowCreateContact();
        });
        // selectedContact = "";
        // let contactDetails = document.getElementById('contactDetails');
        // contactDetails.innerHTML = "<h1>Successfully Deleted</h1>"
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    // document.getElementById("deleteContactResult").innerHTML = err.message;
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

function reselectCurrentContact() {
  if (selectedContact.length == 0) {
    selectFirstContactOrShowCreateContact()
  } else {
    selectContactByID(selectedContact["id"]);
  }
  
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
    document.getElementById("currentUser").innerHTML = firstName + " " + lastName;
  }
}

function selectFirstContactOrShowCreateContact() {
  console.log("selectFirstContactOrShowCreateContact");
  console.log(currentSearchResults);

  if (currentSearchResults.length == 0) {
    const contactDetails = document.getElementById('contactDetails');
    contactDetails.innerHTML = `
      <h1>No Contacts. Click "+ New Contact" to create a contact.</h1>
  `;
  } else {
    let firstContact = currentSearchResults[0];
    selectContact(firstContact);
  }
}

// Function to handle selection of a contact
function selectContact(contact) {
  const items = document.querySelectorAll('.list-group-item');
  items.forEach(item => item.classList.remove('active'));
  let selectedElement = document.getElementById(`contactID${contact["id"]}`);
  selectedElement.classList.add('active');

  selectedContact = contact;
  console.log(`Setting seleced contatc to ${contact}`);

  const contactDetails = document.getElementById('contactDetails');
  contactDetails.innerHTML = `
    <button id="editContactButton" class="btn btn-outline-primary btn-sm" onclick=editSelectedContact()>Edit</button>
    </br></br>
    <h1>${contact["first_name"]} ${contact["last_name"]}</h1>
    </br></br>
    <p><strong>Phone Number:</strong> ${contact["phone_number"]}</p>
    <p><strong>Email:</strong> ${contact["email"]}</p>
  `;
}

function createNewContact() {
  let contactDetails = document.getElementById('contactDetails');
  contactDetails.innerHTML = `
  <button id="cancelEditButton" class="btn btn-outline-primary btn-sm" onclick=reselectCurrentContact()>Cancel</button>
  <button id="saveContactButton" class="btn btn-primary btn-sm" onclick=addContact()><strong>Create</strong></button>

  </br></br>

  <div class="form-floating">
    <input type="text" class="form-control" id="firstNameInput" placeholder="John"">
    <label for="firstNameInput">First Name</label>
  </div>

  <div class="form-floating">
    <input type="text" class="form-control" id="lastNameInput" placeholder="Doe">
    <label for="lastNameInput">Last Name</label>
  </div>

  <div class="form-floating">
    <input type="email" class="form-control" id="phoneInput" placeholder="1234567890">
    <label for="phoneInput">Phone Number</label>
  </div>

  <div class="form-floating">
    <input type="email" class="form-control" id="emailInput" placeholder="name@example.com">
    <label for="emailInput">Email address</label>
  </div>
  `;
}

function addContact() {
  let updatedContactFirstName = document.getElementById("firstNameInput").value;
  let updatedContactLastName = document.getElementById("lastNameInput").value;
  let updatedContactEmail = document.getElementById("emailInput").value;
  let updatedContactPhoneNumber = document.getElementById("phoneInput").value;

  // document.getElementById("addContactResult").innerHTML = "";

  let tmp = { owner: userId, first_name: updatedContactFirstName, last_name: updatedContactLastName, email: updatedContactEmail, phone_number: updatedContactPhoneNumber };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/addContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhr.responseText);
        let jsonObject = JSON.parse(xhr.responseText);
        let addedID = jsonObject["id"];
        console.log(`Added with ID: ${addedID}`)
        // document.getElementById("addContactResult").innerHTML = "Contact has been added";
        // Add the new contact to the list
        const contactList = document.getElementById('contactList');
        const newContact = document.createElement('a');
        newContact.href = "#";
        newContact.className = "list-group-item list-group-item-action py-3 lh-sm";
        newContact.innerHTML = `
      <div class="contact-name">
        <span class="first-name">${updatedContactFirstName}</span>
        <span class="last-name">${updatedContactLastName}</span>
      </div>
    `;
        newContact.onclick = function () { selectContact(newContact) };
        contactList.appendChild(newContact);
        searchContacts(function() {
          selectContactByID(addedID);
        });
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    // document.getElementById("addContactResult").innerHTML = err.message;
  }
}

function selectContactByID(contactID) {
  let contactDetails = currentSearchResults.find(contact => contact["id"] == contactID);
  selectedContact = contactDetails;
  console.log(`Setting seleced contact to ${selectedContact}`);
  selectContact(contactDetails);
}

function editSelectedContact() {
  let contactDetails = document.getElementById('contactDetails');
  // let editButton = document.getElementById('editContactButton');

  // Replace text with input fields
  contactDetails.innerHTML = `
  <button id="cancelEditButton" class="btn btn-outline-primary btn-sm" onclick=reselectCurrentContact()>Cancel</button>
  <button id="saveContactButton" class="btn btn-primary btn-sm" onclick=updateContact()><strong>Save</strong></button>

  </br></br>

  <div class="form-floating">
    <input type="text" class="form-control" id="firstNameInput" placeholder="John" value="${selectedContact["first_name"]}">
    <label for="firstNameInput">First Name</label>
  </div>

  <div class="form-floating">
    <input type="text" class="form-control" id="lastNameInput" placeholder="Doe" value="${selectedContact["last_name"]}">
    <label for="lastNameInput">Last Name</label>
  </div>

  <div class="form-floating">
    <input type="email" class="form-control" id="phoneInput" placeholder="1234567890" value="${selectedContact["phone_number"]}">
    <label for="phoneInput">Phone Number</label>
  </div>

  <div class="form-floating">
    <input type="email" class="form-control" id="emailInput" placeholder="name@example.com" value="${selectedContact["email"]}">
    <label for="emailInput">Email address</label>
  </div>

  </br>

  <button id="deleteContactButton" class="btn btn-outline-danger btn-sm" onclick=deleteContact()>Delete</button>
  `;
}

function updateContact() {
  let selectedContactID = selectedContact["id"];
  let updatedContactFirstName = document.getElementById("firstNameInput").value;
  let updatedContactLastName = document.getElementById("lastNameInput").value;
  let updatedContactEmail = document.getElementById("emailInput").value;
  let updatedContactPhoneNumber = document.getElementById("phoneInput").value;

  // document.getElementById("updateContactResult").innerHTML = "";

  let tmp = { id: selectedContactID, first_name: updatedContactFirstName, last_name: updatedContactLastName, email: updatedContactEmail, phone_number: updatedContactPhoneNumber };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/updateContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // document.getElementById("updateContactResult").innerHTML = "Contact has been updated";
        console.log("Contact has been updated");

        searchContacts(function() {
          reselectCurrentContact();
        });
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("updateContactResult").innerHTML = err.message;
  }

  selectContactByID(selectedContactID);
}


function searchContacts(callback = null) {
  let search = document.getElementById("searchText").value;

  // Create a document fragment
  let fragment = document.createDocumentFragment();

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
        currentSearchResults = jsonObject.results;

        if (jsonObject.results.length == 0) {
          // Optionally handle the case where no contacts are found
        } else {
          for (let i = 0; i < jsonObject.results.length; i++) {
            let result = jsonObject.results[i];
            let foundContact = document.createElement('a');
            foundContact.href = "#";
            foundContact.id = `contactID${result["id"]}`;
            foundContact.className = "list-group-item list-group-item-action py-3 lh-sm";
            foundContact.innerHTML = `
              <div class="contact-name">
                <span class="first-name">${result["first_name"]}</span>
                <span class="last-name">${result["last_name"]}</span>
              </div>
            `;
            foundContact.onclick = function () {
              selectContact(result);
            };
            fragment.appendChild(foundContact);
          }

          // Clear the actual container
          let contactList = document.getElementById('contactList');
          contactList.innerHTML = "";

          // Append the fragment to the actual container
          contactList.appendChild(fragment);

          if (callback) {
            console.log(currentSearchResults);
            callback();
          }
        }
      }
    };

    xhr.send(jsonPayload);
  }
  catch (err) {
    console.error(err.message);
  }
}

function doRegister() {
  userId = 0;
  firstName = "";
  lastName = "";
  email = "";

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
        console.log(xhr.responseText);
        let registeredUser = JSON.parse(xhr.responseText);
        userId = registeredUser["id"];

        if (userId < 1) {
          document.getElementById("registerResult").innerHTML = "Invalid Registration";
          return;
        }

        firstName = registeredUser["first_name"];
        lastName = registeredUser["last_name"];

        saveCookie();
        window.location.href = "contacts.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("registerResult").innerHTML = err.message;
  }

}

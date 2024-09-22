let urlBase = 'http://contacts.hunterdobb.xyz/smallprojectapi';
let extension = 'php';

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
  let selectedContactID = selectedContact["id"];

  let tmp = { id: selectedContactID };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/deleteContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        searchContacts(function () {
          selectedContact = "";
          selectFirstContactOrShowCreateContact();
        });
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
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
  if (currentSearchResults.length == 0) {
    let contactDetails = document.getElementById('contactDetails');
    contactDetails.innerHTML = `
      <h1>No Contacts Found</h1>
  `;
  } else {
    let firstContact = currentSearchResults[0];
    selectContact(firstContact);
  }
}

// Function to handle selection of a contact
function selectContact(contact) {
  let items = document.querySelectorAll('.list-group-item');
  items.forEach(item => item.classList.remove('active'));
  let selectedElement = document.getElementById(`contactID${contact["id"]}`);
  selectedElement.classList.add('active');

  selectedContact = contact;
  console.log(`Setting seleced contatc to ${contact}`);

  let contactDetails = document.getElementById('contactDetails');
  contactDetails.innerHTML = `
    <button id="editContactButton" class="btn btn-outline-primary btn-sm" onclick=editSelectedContact()>Edit</button>
    </br></br>

    <h1 style="display: flex; align-items: center;">
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
    </svg>
    <span style="margin-left: 10px;">${contact["first_name"]} ${contact["last_name"]}</span>
</h1>

    </br>

    <h5 style="display: flex; align-items: center; margin-left: 50px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
        class="bi bi-telephone-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
    </svg>
    <span style="margin-left: 10px;">${contact["phone_number"]}</span>
</h5>

      </br>

      <h5 style="display: flex; align-items: center; margin-left: 50px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" 
      class="bi bi-envelope-fill" viewBox="0 0 16 16">
      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
    </svg>
    <span style="margin-left: 10px;">${contact["email"]}</span>
</h5>
  `;
}

function createNewContact() {
  let search = document.getElementById("searchText");
  
  if (search.value.length != 0) {
    search.value = "";
    searchContacts(null, false);
  }
  
  let contactDetails = document.getElementById('contactDetails');
  contactDetails.innerHTML = `
  <button id="cancelEditButton" class="btn btn-outline-primary btn-sm" onclick=reselectCurrentContact()>Cancel</button>
  <button id="saveContactButton" class="btn btn-primary btn-sm" onclick=addContact()><strong>Create</strong></button>

  <main class="form-addcontact w-100">
  <form>
    <p class="text-danger text-center" id="addContactResult"></p> 

  <div class="row gx-0">
    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="firstNameInput" placeholder="John"">
        <label for="firstNameInput">First Name</label>
        </div>
    </div>

    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="lastNameInput" placeholder="Doe">
        <label for="lastNameInput">Last Name</label>
      </div>
    </div>
    </div>

    <div class="form-floating">
      <input type="email" class="form-control" id="phoneInput" placeholder="1234567890">
      <label for="phoneInput">Phone Number</label>
    </div>

    <div class="form-floating">
      <input type="email" class="form-control" id="emailInput" placeholder="name@example.com">
      <label for="emailInput">Email address</label>
    </div>
  </form>
  </main>
  `;
}

function addContact() {
  let updatedContactFirstName = document.getElementById("firstNameInput").value;
  let updatedContactLastName = document.getElementById("lastNameInput").value;
  let updatedContactEmail = document.getElementById("emailInput").value;
  let updatedContactPhoneNumber = document.getElementById("phoneInput").value;

  document.getElementById("addContactResult").innerHTML = "";

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
        document.getElementById("addContactResult").innerHTML = "Contact has been added";
        // Add the new contact to the list
        let contactList = document.getElementById('contactList');
        let newContact = document.createElement('a');
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
        searchContacts(function () {
          selectContactByID(addedID);
        });
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("addContactResult").innerHTML = "Please fill out all fields and try again.";
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

  <main class="form-addcontact w-100">
  <form>
    <p class="text-danger text-center" id="editContactResult"></p> 

  <div class="row gx-0">
    <div class="col">
      <div class="form-floating">
        <input type="text" class="form-control" id="firstNameInput" placeholder="John" value="${selectedContact["first_name"]}">
        <label for="firstNameInput">First Name</label>
      </div>
    </div>

    <div class="col">
      <div class="form-floating">
      <input type="text" class="form-control" id="lastNameInput" placeholder="Doe" value="${selectedContact["last_name"]}">
      <label for="lastNameInput">Last Name</label>
      </div>
    </div>
    </div>

    <div class="form-floating">
      <input type="email" class="form-control" id="phoneInput" placeholder="1234567890" value="${selectedContact["phone_number"]}">
      <label for="phoneInput">Phone Number</label>
    </div>

    <div class="form-floating">
      <input type="email" class="form-control" id="emailInput" placeholder="name@example.com" value="${selectedContact["email"]}">
      <label for="emailInput">Email address</label>
    </div>
  </form>
  </main>
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

  let tmp = { id: selectedContactID, first_name: updatedContactFirstName, last_name: updatedContactLastName, email: updatedContactEmail, phone_number: updatedContactPhoneNumber };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/updateContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Contact has been updated");

        searchContacts(function () {
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


function searchContacts(callback = null, selectFirst = true) {
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
        
        if (jsonObject.results.length == 0) {
          // Optionally handle the case where no contacts are found
          let contactList = document.getElementById('contactList');
          contactList.innerHTML = "";

          contactList.innerHTML = `<p style="text-align: center;">No Contacts Found</p>`;
          currentSearchResults = "";

          let contactDetails = document.getElementById('contactDetails');
          contactDetails.innerHTML = `
            <h1>No Contacts Found</h1>
          `;
        } else {
          currentSearchResults = jsonObject.results;

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

          if (selectFirst) {
            selectFirstContactOrShowCreateContact();
          } else {
            console.log("Don't select first");
          }

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

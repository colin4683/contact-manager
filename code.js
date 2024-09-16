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

function deleteContact() {
  let existingContactID = document.getElementById("deleteContactID").value;

  document.getElementById("deleteContactResult").innerHTML = "";

  let tmp = { id: existingContactID };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/deleteContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("deleteContactResult").innerHTML = "Contact has been deleted";
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  }
  catch (err) {
    document.getElementById("deleteContactResult").innerHTML = err.message;
  }
}

// New Delete to integrate aspects from 1 and 2
function deleteContact3() {
  //check certainty
  const response = prompt("Are you sure? Type Yes or No");
  const check = response.toLocaleLowerCase();
  if (check.localeCompare("yes") == 0)  {
    // Remove contact to the list
    const contactList = document.getElementById('contactList');
    const items = document.querySelectorAll('.active');
    const oldContact = items[0];
    contactList.removeChild(oldContact);

    // Set Contact Details to default
    const contactDetails = document.getElementById('contactDetails');
    contactDetails.innerHTML = `
      <div class="content-pane flex-grow-1 bg-white" id="contactDetails">
        <h3>Contact Details</h3>
        <p>Select a contact to view details.</p>
      </div>
    `;

    // Remove from Database
    // Need to figure out an ID to get a specific contact from html
    let tmp = { id: existingContactID };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/deleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //Success Toast?
        }
      };
      xhr.send(jsonPayload);
    }
    catch (err) {
      //error toast?
    }
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
    document.getElementById("currentUser").innerHTML = firstName + " " + lastName;
  }
}

// Function to handle selection of a contact
function selectContact(element, result) {
  const items = document.querySelectorAll('.list-group-item');
  items.forEach(item => item.classList.remove('active'));
  element.classList.add('active');

  const contactDetails = document.getElementById('contactDetails');
  contactDetails.innerHTML = `
    <h1>${result["first_name"]} ${result["last_name"]}</h1>
    </br></br>
    <p><strong>Phone Number:</strong> ${result["phone_number"]}</p>
    <p><strong>Email:</strong> ${result["email"]}</p>
    </br></br>
    <button class="btn btn-primary btn-sm" onclick="updateContact2()">Update Contact</button>
    <button class="btn btn-danger btn-sm" onclick="deleteContact2()">Delete Contact</button>
  `;
}

// General update format function
function updateDetails(contactInfo) {
  // Update Contact List
  const contactList = document.getElementById('contactList');
  const items = document.querySelectorAll('.active');
  const oldContact = items[0];
  oldContact.innerHTML = `
      <div class="contact-name">
        <span class="first-name">${contactInfo["first_name"]}</span>
        <span class="last-name">${contactInfo["last_name"]}</span>
      </div>
    `;
  oldContact.onclick = function() { selectContact(oldContact, contactInfo) };
  contactList.appendChild(oldContact);

  // Update Contact Details
  const contactDetails = document.getElementById('contactDetails');
  contactDetails.innerHTML = `
    <h1>${contactInfo["first_name"]} ${contactInfo["last_name"]}</h1>
    </br></br>
    <p><strong>Phone Number:</strong> ${contactInfo["phone_number"]}</p>
    <p><strong>Email:</strong> ${contactInfo["email"]}</p>
    </br></br>
    <button class="btn btn-primary btn-sm" onclick="updateContact2()">Update Contact</button>
    <button class="btn btn-danger btn-sm" onclick="deleteContact2()">Delete Contact</button>
  `;
}


function searchContacts() {
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
        } else {
          for (let i = 0; i < jsonObject.results.length; i++) {
            let result = jsonObject.results[i];
            let foundContact = document.createElement('a');
            foundContact.href = "#";
            foundContact.className = "list-group-item list-group-item-action py-3 lh-sm";
            foundContact.innerHTML = `
              <div class="contact-name">
                <span class="first-name">${result["first_name"]}</span>
                <span class="last-name">${result["last_name"]}</span>
              </div>
            `;
            foundContact.onclick = function () {
              selectContact(foundContact, result);
            };
            fragment.appendChild(foundContact);
          }

          // Clear the actual container
          let contactList = document.getElementById('contactList');
          contactList.innerHTML = "";

          // Append the fragment to the actual container
          contactList.appendChild(fragment);
        }
      }
    };

    xhr.send(jsonPayload);
  }
  catch (err) {
    console.error(err.message);
  }
}


// function searchContacts() {
//   let search = document.getElementById("searchText").value;

//   // let contactList = "";

//   // let contactList = document.getElementById('contactList');
//   // // contactList.innerHTML = ""; // empty out current list
//   // let tempList = contactList;
//   // tempList.innerHTML = "";

//   // Create a temporary container
//   let tempContainer = document.createElement('div');

//   let tmp = { search: search, owner: userId };
//   let jsonPayload = JSON.stringify(tmp);

//   let url = urlBase + '/search.' + extension;

//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

//   try {
//     xhr.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//         let jsonObject = JSON.parse(xhr.responseText);

//         if (jsonObject.results.length == 0) {
//           // document.getElementById("contactSearchResult").innerHTML = "No Contacts Found";
//         } else {
//           // document.getElementById("contactSearchResult").innerHTML = "";
//           // document.getElementById("contactSearchResult").innerHTML = xhr.responseText;
//         }

//         for (let i = 0; i < jsonObject.results.length; i++) {
//           let result = jsonObject.results[i];
//           let foundContact = document.createElement('a');
//           foundContact.href = "#";
//           foundContact.className = "list-group-item list-group-item-action py-3 lh-sm";
//           foundContact.innerHTML = `
//           <div class="contact-name">
//             <span class="first-name">${result["first_name"]}</span>
//             <span class="last-name">${result["last_name"]}</span>
//           </div>
//         `;
//           foundContact.onclick = function () { selectContact(foundContact, result["first_name"], result["last_name"]) };
//           tempContainer.appendChild(foundContact);
//           // let foundContact = result["id"] + " " + result["first_name"] + " " + result["last_name"] + ": " + result["phone_number"] + " | " + result["email"];
//           // contactList += foundContact;
//           // if (i < jsonObject.results.length - 1) {
//           //   contactList += "<br />\r\n";
//           // }
//         }

//         let contactList = document.getElementById('contactList');
//         contactList.innerHTML = tempContainer.innerHTML;

//         // document.getElementById("contactList").innerHTML = contactList;
//       }
//     };

//     xhr.send(jsonPayload);
//   }
//   catch (err) {
//     // document.getElementById("contactSearchResult").innerHTML = err.message;
//   }
// }

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

// Framework to integrate aspects from addContact and createNewContact
function createNewContact2() {
  const newName = prompt("Enter the contact's name:");
  const newEmail = prompt("Enter the contact's email:");
  const newNumber = prompt("Enter the contact's phone number:");
  if (newName) {
    // Add the new contact to the list
    const contactList = document.getElementById('contactList');
    const newContact = document.createElement('a');
    const contactInfo = {"first_name": newName.split(' ')[0], "last_name":newName.split(' ')[1] || '',
    "email": newEmail, "phone_number": newNumber};
    newContact.href = "#";
    newContact.className = "list-group-item list-group-item-action py-3 lh-sm";
    newContact.innerHTML = `
      <div class="contact-name">
        <span class="first-name">${newName.split(' ')[0]}</span>
        <span class="last-name">${newName.split(' ')[1] || ''}</span>
      </div>
    `;
    newContact.onclick = function() { selectContact(newContact, contactInfo) };
    contactList.appendChild(newContact);
   
    //success toast?
  }
}

function updateContact() {
  let existingContactID = document.getElementById("existingContactID").value;
  let updatedContactFirstName = document.getElementById("updatedContactFirstName").value;
  let updatedContactLastName = document.getElementById("updatedContactLastName").value;
  let updatedContactEmail = document.getElementById("updatedContactEmail").value;
  let updatedContactPhoneNumber = document.getElementById("updatedContactPhoneNumber").value;

  document.getElementById("updateContactResult").innerHTML = "";

  let tmp = { id: existingContactID, first_name: updatedContactFirstName, last_name: updatedContactLastName, email: updatedContactEmail, phone_number: updatedContactPhoneNumber };
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

// Framework to integrate aspects form updateContact 1 and 2
function updateContact3() {
  // New contact information
  const newName = prompt("Enter the contact's name:");
  const newEmail = prompt("Enter the contact's email:");
  const newNumber = prompt("Enter the contact's phone number:");
  if (newName) {
    // Update contact on the list
    const contactInfo = {"first_name": newName.split(' ')[0], "last_name":newName.split(' ')[1] || '',
      "email": newEmail, "phone_number": newNumber}
    let jsonPayload = JSON.stringify(contactInfo);

    let url = urlBase + '/updateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          updateDetails(contactInfo);
          //Success toast?
        }
      };
      xhr.send(jsonPayload);
    }
    catch (err) {
      //Error toast?
    }
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

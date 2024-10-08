// Citation for the following page:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Citation for the following function of autofill input after dropdown selection:
// Date: 06-07-2024
// Adapted from: Autofill input after selected select option Javascript DOM
// Source URL: https://stackoverflow.com/questions/67231953/autofill-input-after-selected-select-option-javascript-dom

let customerSelect = document.getElementById("customerSelect");
let inputEmail = document.getElementById("input-email-update");
let inputPhoneNumber = document.getElementById("input-phone_number-update");

// Add event listener to the customer drop-down
customerSelect.addEventListener("change", function () {
    // Get the selected option
    let selectedOption = customerSelect.options[customerSelect.selectedIndex];

    // Get the email and phone from the data attributes
    let email = selectedOption.getAttribute("data-email");
    let phone = selectedOption.getAttribute("data-phone");

    // Update the email and phone input fields
    inputEmail.value = email;
    inputPhoneNumber.value = phone;
});


// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("customerSelect");
    let inputEmail = document.getElementById("input-email-update");
    let inputPhoneNumber = document.getElementById("input-phone_number-update");


    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let emailValue = inputEmail.value;
    let phoneNumberValue = inputPhoneNumber.value;


    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        email: emailValue,
        phoneNumber: phoneNumberValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
        
        // Reload page
        window.location.reload();
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, customer_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customer_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let email_td = updateRowIndex.getElementsByTagName("td")[3];
            let phone_td = updateRowIndex.getElementsByTagName("td")[4];

            // 
            email_td.innerHTML = parsedData[0].emailValue; 
            phone_td.innerHTML = parsedData[0].phoneNumberValue; 
          

       }
    }
}


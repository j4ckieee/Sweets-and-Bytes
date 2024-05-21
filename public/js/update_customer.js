
// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    // let inputHomeworld = document.getElementById("input-homeworld-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputPhoneNumber = document.getElementById("input-phone_number-update");


    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    // let homeworldValue = inputHomeworld.value;
    let emailValue = inputEmail.value;
    let phoneNumberValue = inputPhoneNumber.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (!!phoneNumberValue || !!emailValue ) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        // homeworld: homeworldValue,
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

            // Reassign homeworld to our value we updated to
            // console.log(parsedData[0]);
            // console.log(parsedData);
            // console.log(parsedData.phoneNumberValue);
            // console.log(parsedData.emailValue);
            // console.log(parsedData[0].name);

            // below code does not work.
            email_td.innerHTML = parsedData[0].emailValue; 
            phone_td.innerHTML = parsedData[0].phoneNumberValue; 
          

       }
    }
}


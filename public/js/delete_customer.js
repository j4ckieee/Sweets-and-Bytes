// Citation for the following function:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


function deleteCustomer(customer_id) {
    // Citation for confirm deletion:
    // Date: 06-07-24
    // Adapted from: mdn web docs
    // Source URL: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm

    // Confirm window
    let confirmDelete = window.confirm("Are you sure you want to delete this customer? \n\nNote: Existing orders will still remain after customer deletion.");
    
    if (!confirmDelete) {
        return; 
    }
    
    // Put our data we want to send in a javascript object
    let data = {
        customer_id: customer_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table 
            deleteRow(customer_id);
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    window.location.reload();
}


// Deletes row from data table if customer is removed
function deleteRow(customer_id){

    let table = document.getElementById("customer-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == customer_id) {
            table.deleteRow(i);
            break;
       }
    }
}


// Deletes names from drop down menu if customer is removed from database
function deleteDropDownMenu(customer_id){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(customer_id)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }
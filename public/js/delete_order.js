// Citation for the following function:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main



function deleteOrder(order_id) {

    // Citation for confirm deletion:
    // Date: 06-07-24
    // Adapted from: mdn web docs
    // Source URL: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm

    // Confirm window
    let confirmDelete = window.confirm("Are you sure you want to delete this order? \n\nNote: Orders will not deleted if there are products in them.\nPlease make sure the subtotal is $0.00 before proceeding.");
    
    if (!confirmDelete) {
        return; 
    }

    // Put our data we want to send in a javascript object
    let data = {
        order_id: order_id
    };
    console.log(order_id)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(order_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    // Reload page
    window.location.reload();
}


function deleteRow(order_id){
    let table = document.getElementById("order-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == order_id) {
            table.deleteRow(i);
            break;
       }
    }
}
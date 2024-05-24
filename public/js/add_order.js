// Citation for the following function:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    // let inputCustomerId = document.getElementById("input-customer_id");
    let inputOrderDate = document.getElementById("input-order_date");
    let inputTotalPrice = document.getElementById("input-total_price");

    // Get the values from the form fields
    // let customerIdValue = inputCustomerId.value;
    let orderDateValue = inputOrderDate.value;
    let totalPriceValue = inputTotalPrice.value;


    // Put our data we want to send in a javascript object
    let data = {
        // customer_id: customerIdValue,
        order_date: orderDateValue,
        total_price: totalPriceValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            // inputCustomerId.value = '';
            inputOrderDate.value = '';
            inputTotalPrice.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("order-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    // let customerIdCell = document.createElement("TD");
    let orderDateCell = document.createElement("TD");
    let totalPriceCell = document.createElement("TD");

    // Delete
    let deleteCell = document.createElement("TD");

    

    // Fill the cells with correct data
    // customerIdCell.innerText = newRow.customer_id;
    orderDateCell.innerText = newRow.order_date;
    totalPriceCell.innerText = newRow.total_price;

    // Delete
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteOrder(newRow.order_id);
    };
   

    // Add the cells to the row 
    // row.appendChild(customerIdCell);
    row.appendChild(orderDateCell);
    row.appendChild(totalPriceCell);

    
    // Add the row to the table
    currentTable.appendChild(row);
}
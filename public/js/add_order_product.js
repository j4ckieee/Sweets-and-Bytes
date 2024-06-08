// Citation for the following function:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Get the objects we need to modify
let addOrderProductForm = document.getElementById('add-order-product-form');

// Modify the objects we need
addOrderProductForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("orderSelect");
    let inputProductID = document.getElementById("productSelect");
    let inputQuantity = document.getElementById("input-quantity");

    // Get the values from the form fields
    let orderIDValue = inputOrderID.value;
    let productIDValue = inputProductID.value;
    let quantityValue = inputQuantity.value;

    // Put our data we want to send in a javascript object
    let data = {
        order_id: orderIDValue,
        product_id: productIDValue,
        quantity: quantityValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Reload page
            window.location.reload();
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            // Check if the error message is "Out of inventory"
            if (xhttp.responseText === "Out of inventory") {
                // Show the pop-up window with the error message
                alert("The update cannot be processed. There is not enough product inventory.");
            } else {
                console.log("There was an error with the input.");
            }
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// BELOW NEEDS TO BE UPDATED!!!!!!!

// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("order_products-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    //let idCell = document.createElement("TD");
    let orderIDCell = document.createElement("TD");
    let orderProductIDeCell = document.createElement("TD");
    let productNameCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let unitPriceCell = document.createElement("TD");
    let totalCell = document.createElement("TD");


    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderIDCell.innerText = newRow.order_id;
    orderProductIDCell.innerText = newRow.order_product_id;
    productNameCell.innerText = newRow.product_name;
    quantityCell.innerText = newRow.product_ordered_qt;
    unitPriceCell.innerText = newRow.product_price;
    totalCell.innerText = newRow.total;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteCustomer(newRow.order_product_id);
    };

    // Add the cells to the row 
    //row.appendChild(idCell);
    row.appendChild(orderIDCell);
    row.appendChild(orderProductIDCell);
    row.appendChild(productNameCell);
    row.appendChild(quantityCell);
    row.appendChild(unitPriceCell);
    row.appendChild(totalCell);
    row.appendChild(deleteCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.order_product_id);

    
    // Add the row to the table
    currentTable.appendChild(row);


    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.first_name + ' ' +  newRow.last_name;
    option.value = newRow.customer_id;
    selectMenu.add(option);
    // End of new step 8 code.



    
}
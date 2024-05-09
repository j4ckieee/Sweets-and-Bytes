// Get the objects we need to modify
let addProductForm = document.getElementById('add-product-form-ajax');

// Modify the objects we need
addProductForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProductName = document.getElementById("input-product_name");
    let inputProductDescription = document.getElementById("input-product_description");
    let inputProductPrice = document.getElementById("input-product_price");
    let inputProductInventory = document.getElementById("input-product_inventory");

    // Get the values from the form fields
    let productNameValue = inputProductName.value;
    let productDescriptionValue = inputProductDescription.value;
    let productPriceValue = inputProductPrice.value;
    let productInventoryValue = inputProductInventory.value;

    // Put our data we want to send in a javascript object
    let data = {
        product_name: productNameValue,
        product_description: productDescriptionValue,
        product_price: productPriceValue,
        product_inventory: productInventoryValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputProductName.value = '';
            inputProductDescription.value = '';
            inputProductPrice.value = '';
            inputProductInventory.value = '';
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
    let currentTable = document.getElementById("product-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    //let idCell = document.createElement("TD");
    let productNameCell = document.createElement("TD");
    let productDescriptionCell = document.createElement("TD");
    let productPriceCell = document.createElement("TD");
    let productInventoryCell = document.createElement("TD");

    // Fill the cells with correct data
    //idCell.innerText = newRow.id;
    productNameCell.innerText = newRow.product_name;
    productDescriptionCell.innerText = newRow.product_description;
    productPriceCell.innerText = newRow.product_price;
    productInventoryCell.innerText = newRow.product_inventory;

    // Add the cells to the row 
    //row.appendChild(idCell);
    row.appendChild(productNameCell);
    row.appendChild(productDescriptionCell);
    row.appendChild(productPriceCell);
    row.appendChild(productInventoryCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
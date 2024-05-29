// Citation for the following function:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Get the objects we need to modify
let updateOrderProductForm = document.getElementById('update-order-product-form');

// Modify the objects we need
updateOrderProductForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrder = document.getElementById("orderSelectUpdate");
    let inputProduct = document.getElementById("productSelectUpdate");
    let inputQuantity = document.getElementById("input-quantity-update");


    // Get the values from the form fields
    let orderValue = inputOrder.value;
    let productValue = inputProduct.value;
    let quantityValue = inputQuantity.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(orderValue) || isNaN(productValue) || isNaN(quantityValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        order: orderValue,
        product: productValue,
        quantity: quantityValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderValue, productValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    console.log("data", data)
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, order_id, product_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("order_products-table");

    console.log("key",`${order_id}-${product_id}`)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       console.log("key",`${order_id}-${product_id}`)
       console.log("data-value", table.rows[i].getAttribute("data-value"))
       if (table.rows[i].getAttribute("data-value") == `${order_id}-${product_id}`) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
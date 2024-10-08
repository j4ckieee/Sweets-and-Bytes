// Citation for the following page:
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


    // Citation for alert message:
    // Date: 06-08-24
    // Adapted from: w3 schools
    // Source URL: https://www.w3schools.com/js/js_popup.asp

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

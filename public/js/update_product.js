// Citation for the page:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Get the objects we need to modify
let updateProductProductForm = document.getElementById('update-product-form');

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
// Citation for the following function of autofill input after dropdown selection:
// Date: 06-07-2024
// Adapted from: Autofill input after selected select option Javascript DOM
// Source URL: https://stackoverflow.com/questions/67231953/autofill-input-after-selected-select-option-javascript-dom

let inputProduct = document.getElementById("input-product_id-update");
let inputPrice = document.getElementById("input-price-product-update");
let inputInventory = document.getElementById("input-inventory-product-update");

// Add event listener to the product drop-down
inputProduct.addEventListener("change", function () {
    // Get the selected option
    let selectedOption = inputProduct.options[inputProduct.selectedIndex];

    // Get the price from the data attribute
    let price = selectedOption.getAttribute("data-price");
    let inventory = selectedOption.getAttribute("data-inventory");

    // Update the price input field
    inputPrice.value = price;
    inputInventory.value = inventory;
});


// Modify the objects we need
updateProductProductForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProduct = document.getElementById("input-product_id-update");
    let inputPrice = document.getElementById("input-price-product-update");
    let inputInventory = document.getElementById("input-inventory-product-update");


    // Get the values from the form fields
    let productValue = inputProduct.value;
    let priceValue = inputPrice.value;
    let inventoryValue = inputInventory.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(productValue) || isNaN(priceValue) || isNaN(inventoryValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        product: productValue,
        price: priceValue,
        inventory: inventoryValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");


    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
 
            // Reload page
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    console.log("data", data)
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));


} )

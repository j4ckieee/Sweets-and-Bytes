// Citation for the following function:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


function deleteProduct(product_id) {

    // Citation for confirm deletion:
    // Date: 06-07-24
    // Adapted from: mdn web docs
    // Source URL: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm

    // Confirm window
    let confirmDelete = window.confirm("Are you sure you want to delete this product from the inventory? \n\nNote: Product will not be deleted from inventory if there are already orders placed for it.");
    
    if (!confirmDelete) {
        return; 
    }

    // Put our data we want to send in a javascript object
    let data = {
        product_id: product_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 204) {
                // Reload the page to reflect changes
                window.location.reload();
            } else {
                console.log("There was an error with the input.");
            }
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
};

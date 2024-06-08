// Citation for the following function:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


function deleteOrder(order_id) {
    // Confirm deletion
    let confirmDelete = window.confirm("Are you sure you want to delete this order? \n\nNote: Orders will not be deleted if there are products in them.\nPlease make sure the subtotal is $0.00 before proceeding.");

    if (!confirmDelete) {
        return;
    }

    // Data to be sent
    let data = {
        order_id: order_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 204) {
                // Reload the page to reflect changes
                window.location.reload();
            } else if (xhttp.status == 400) {
                console.log("Order cannot be deleted because it contains products.");
                alert("Order cannot be deleted because it contains products.");
            } else {
                console.log("There was an error with the input.");
                alert("There was an error with the input.");
            }
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
};


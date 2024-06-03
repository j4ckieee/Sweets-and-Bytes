// Citation for the following function:
// Date: 05-23-24
// Adapted from: nodejs-starter-app
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

function deleteOrderProducts(order_product_id) {
    // Put our data we want to send in a javascript object
    let data = {
        order_product_id: order_product_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table 
            // PERSON ID IS WRONG BUT IT STOPS WORKING IF I CHANGE IT???????
            // deleteRow(order_product_id);

            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    //doesnt wait for the ready state.
    window.location.reload();

}


// Deletes row from data table if customer is removed
function deleteRow(order_product_id){

    let table = document.getElementById("order_products-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == order_product_id) {
            table.deleteRow(i);
            break;
       }
    }
}


// Deletes names from drop down menu if customer is removed from database
function deleteDropDownMenu(order_product_id){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(order_product_id)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }
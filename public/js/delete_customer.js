function deleteCustomer(customer_id) {
    // Put our data we want to send in a javascript object
    let data = {
        customer_id: customer_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table 
            // PERSON ID IS WRONG BUT IT STOPS WORKING IF I CHANGE IT???????
            deleteRow(personID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


// Deletes row from data table if customer is removed
function deleteRow(customer_id){

    let table = document.getElementById("customer-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == customer_id) {
            table.deleteRow(i);
            break;
       }
    }
}


// Deletes names from drop down menu if customer is removed from database
function deleteDropDownMenu(customer_id){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(customer_id)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }
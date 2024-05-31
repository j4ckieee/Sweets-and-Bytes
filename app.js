// App.js

/* -------------------------------*/
/* ------------ SETUP ------------*/
/* -------------------------------*/

var express = require('express');   
var app     = express();            
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 8463; 

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');                 


/* -------------------------------*/
/* ------------ ROUTES -----------*/
/* -------------------------------*/

/////////
// GET // - routes to the pages and also locates the data we need to display
////////

app.get('/', function(req, res)
    {
        res.render('index');                   
    });  


app.get('/customers', function(req, res)
    {  
        let query1 = "SELECT * FROM Customers;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('customers', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

app.get('/products', function(req, res)
    {  
        let query1 = "SELECT * FROM Products;";               

        db.pool.query(query1, function(error, rows, fields){    

            res.render('products', {data: rows});                  
        })                                                      
    }); 


app.get('/order_products', function(req, res)
{         
    let query1 = `SELECT
    *,
    ((Order_Products.product_ordered_qt) * (Products.product_price)) as 'total'
    from Orders
    INNER JOIN Order_Products ON Orders.order_id = Order_Products.order_id
    INNER JOIN Products ON Order_Products.product_id = Products.product_id
    ORDER BY Orders.order_id ASC;
    `;
    let query2 = "SELECT * FROM Products;";
    let query3 = "SELECT * FROM Orders;";

    db.pool.query(query1, function(error, rows, fields){
    
        // Save the people
        let orderProducts = rows;
        
        // Run the 2nd query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let products = rows;
    
            // Run the 3rd query
            db.pool.query(query3, (error, rows, fields) => {
                
                // Save the ships
                let orders = rows;
    
                // Render the data to the index view
                return res.render('order_products', {orderProducts: orderProducts, products: products, orders: orders});
            });
        });
    })});


app.get('/orders', function(req, res)
    {  
        let query1 = `SELECT *,
        Orders.order_id as 'orderID',
        COALESCE(sum((Order_Products.product_ordered_qt) * (Products.product_price)), 0) as 'subtotal'
        FROM Orders
        LEFT JOIN Order_Products ON Orders.order_id = Order_Products.order_id
        LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id
        LEFT JOIN Products ON Order_Products.product_id = Products.product_id
        GROUP BY Orders.order_id
        ORDER BY Orders.order_id ASC;`;

        // Query 2
        let query2 = "SELECT * FROM Customers;";

        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let orders = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let customers = rows;
            return res.render('orders', {data: orders, customers: customers});
        })                 
        })                                                      
    }); 

                                                     


//////////
// POST // - add data
/////////

app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let email = data['input-email'];
    if (!!email)
    {
        email = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (first_name, last_name, email, phone_number) VALUES ('${data['input-first_name']}', '${data['input-last_name']}', '${data['input-email']}', '${data['input-phone_number']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/customers');
        }
    })
})

app.post('/add-product-form', function(req, res){
    let data = req.body;
   
    query1 = `INSERT INTO Products (product_name, product_description, product_price, product_inventory) VALUES ('${data['input-product_name']}', '${data['input-product_description']}', ${data['input-product_price']}, ${data['input-product_inventory']})`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            res.redirect('/products');
        }
    })
});


app.post('/add-order-product-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Check if adding the order product would result in negative inventory
    let checkQuery = `SELECT product_inventory FROM Products WHERE product_id = '${data.product_id}'`;

    // Run the query to check the current product quantity
    db.pool.query(checkQuery, function(error, rows, fields) {
        // Check if there was an error
        if (error) {
            // Log the error to the terminal and send a 400 response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Calculate the new product quantity after adding the order product
            let currentQuantity = rows[0].product_inventory;
            let newQuantity = currentQuantity - data.quantity;
            
            // Check if the new product quantity would be negative
            if (newQuantity >= 0) {
                // If not negative, proceed with inserting the order product
                let insertQuery = `INSERT INTO Order_Products (order_id, product_id, product_ordered_qt) VALUES('${data.order_id}', '${data.product_id}', '${data.quantity}')`;
                
                // Run the query to insert the new order product
                db.pool.query(insertQuery, function(error, rows, fields) {
                    // Check if there was an error
                    if (error) {
                        // Log the error to the terminal and send a 400 response
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        // If there was no error, update the product_quantity in the Products table
                        let updateQuery = `UPDATE Products SET product_inventory = ${newQuantity} WHERE product_id = '${data.product_id}'`;

                        // Run the query to update the product_quantity
                        db.pool.query(updateQuery, function(error, rows, fields) {
                            // Check if there was an error
                            if (error) {
                                // Log the error to the terminal and send a 400 response
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                // If all went well, perform a SELECT to retrieve the updated data
                                let selectQuery = `SELECT *,
                                    ((Order_Products.product_ordered_qt) * (Products.product_price)) as 'total'
                                    FROM Orders
                                    INNER JOIN Order_Products ON Orders.order_id = Order_Products.order_id
                                    INNER JOIN Products ON Order_Products.product_id = Products.product_id
                                    ORDER BY Orders.order_id ASC`;

                                // Run the query to retrieve the updated data
                                db.pool.query(selectQuery, function(error, rows, fields) {
                                    // Check if there was an error
                                    if (error) {
                                        // Log the error to the terminal and send a 400 response
                                        console.log(error);
                                        res.sendStatus(400);
                                    } else {
                                        // If all went well, send the results of the query back
                                        res.send(rows);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                // If adding the order product would result in negative inventory, send a 400 response
                res.status(400).send("Out of inventory");           
            }
        }
    });
});


app.post('/add-order-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customer_id, order_date) VALUES ('${data['input-customer_id']}', '${data['input-order_date']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route
        else
        {
            res.redirect('/orders');
        }
    })
})


////////////
// DELETE // - Delete data
///////////

app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let customerId = parseInt(data.customer_id);
    let deleteCustomers= `DELETE FROM Customers WHERE customer_id = ?`;
  
          // Run the 1st query
          db.pool.query(deleteCustomers, [customerId], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  })});


  app.delete('/delete-order-ajax/', function(req,res,next){
    let data = req.body;
    let order_id = parseInt(data.order_id);
    let deleteOrders = `DELETE FROM Orders WHERE order_id = ?`;
  
          // Run the 1st query
          db.pool.query(deleteOrders, [order_id], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
})});

app.delete('/delete-product-ajax/', function(req,res,next){
    let data = req.body;
    let productId = parseInt(data.product_id);
    let deleteProduct = `DELETE FROM Products WHERE product_id = ?`;
  
          db.pool.query(deleteProduct, [productId], function(error, rows, fields){
            if (error) {
            console.log(error);
            res.sendStatus(400);
            }
})});

app.delete('/delete-order-product-ajax/', function(req,res,next){
    let data = req.body;
    let order_product_id = parseInt(data.order_product_id);
    let deleteOrderProduct = `DELETE FROM Order_Products WHERE order_product_id = ?`;
  
          db.pool.query(deleteOrderProduct, [order_product_id], function(error, rows, fields){
            if (error) {
            console.log(error);
            res.sendStatus(400);
            }
})});

/////////
// PUT // - Update data 
////////

app.put('/put-customer-ajax', function(req,res,next){
    let data = req.body;
  
    let person = parseInt(data.fullname); // need review, do we need to parseInt name?
    let email = data.email;
    let phoneNumber = data.phoneNumber;
  
    let queryUpdateCustomer = `UPDATE Customers SET phone_number = ?, email = ? WHERE customer_id = ?`;
          // Run the 1st query
          db.pool.query(queryUpdateCustomer, [phoneNumber, email, person], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
              else {
                res.send(rows);
            }
  
  })});


  app.put('/put-order-product-ajax', function(req,res,next){
    let data = req.body;
  
    let order = data.order;
    let product = data.product;
    let quantity = data.quantity;
  

    let queryUpdateOrderProduct = `Update Order_Products SET product_ordered_qt = ? WHERE order_id = ? and product_id = ?`;
          // Run the 1st query
          db.pool.query(queryUpdateOrderProduct, [quantity, order, product], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
              else {
                res.send(rows);
            }
  
  })});


/* ----------------------------------*/
/* ------------ LISTENER ------------*/
/* ----------------------------------*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});
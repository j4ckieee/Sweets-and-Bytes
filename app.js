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

// ------------ JUST FOR FINAL SUBMISSION ------

app.get('/order_products', function(req, res) {
    async.parallel({
        ordersData: function(callback) {
            let query1 = `SELECT Orders.order_id,
                first_name,
                last_name,
                Orders.order_date,
                (sum((Order_Products.product_ordered_qt) * (Products.product_price))) as 'subtotal'
                FROM Orders
                LEFT JOIN Order_Products ON Orders.order_id = Order_Products.order_id
                INNER JOIN Customers ON Orders.customer_id = Customers.customer_id
                LEFT JOIN Products ON Order_Products.product_id = Products.product_id
                GROUP BY Order_Products.order_id
                ORDER BY Orders.order_id ASC;`;

            db.pool.query(query1, function(error, rows, fields) {
                callback(error, rows);
            });
        },
        orderDetails: function(callback) {
            let query2 = `SELECT
            Orders.order_id,
            Products.product_name,
            Order_Products.product_ordered_qt,
            Products.product_price,
            ((Order_Products.product_ordered_qt) * (Products.product_price)) as 'total'
            from Orders
            INNER JOIN Order_Products ON Orders.order_id = Order_Products.order_id
            INNER JOIN Products ON Order_Products.product_id = Products.product_id
            ORDER BY Orders.order_id ASC;
            `;

            db.pool.query(query2, function(error, rows, fields) {
                callback(error, rows);
            });
        }
    }, function(err, results) {
        if (err) {
            // Handle error
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.render('order_products', { ordersData: results.ordersData, orderDetails: results.orderDetails });
    });
});          
// -------------

const async = require('async');
app.get('/orders', function(req, res) {
    async.parallel({
        ordersData: function(callback) {
            let query1 = `SELECT Orders.order_id,
                first_name,
                last_name,
                Orders.order_date,
                (sum((Order_Products.product_ordered_qt) * (Products.product_price))) as 'subtotal'
                FROM Orders
                LEFT JOIN Order_Products ON Orders.order_id = Order_Products.order_id
                INNER JOIN Customers ON Orders.customer_id = Customers.customer_id
                LEFT JOIN Products ON Order_Products.product_id = Products.product_id
                GROUP BY Order_Products.order_id
                ORDER BY Orders.order_id ASC;`;

            db.pool.query(query1, function(error, rows, fields) {
                callback(error, rows);
            });
        },
        orderDetails: function(callback) {
            let query2 = `SELECT
            Orders.order_id,
            Products.product_name,
            Order_Products.product_ordered_qt,
            Products.product_price,
            ((Order_Products.product_ordered_qt) * (Products.product_price)) as 'total'
            from Orders
            INNER JOIN Order_Products ON Orders.order_id = Order_Products.order_id
            INNER JOIN Products ON Order_Products.product_id = Products.product_id
            ORDER BY Orders.order_id ASC;
            `;

            db.pool.query(query2, function(error, rows, fields) {
                callback(error, rows);
            });
        }
    }, function(err, results) {
        if (err) {
            // Handle error
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.render('orders', { ordersData: results.ordersData, orderDetails: results.orderDetails });
    });
});

                                                     


//////////
// POST // - add data
/////////

app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let email = parseInt(data['input-email']);
    if (isNaN(email))
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
    let orderId = parseInt(data.order_id);
    let deleteOrders = `DELETE FROM Orders WHERE order_id = ?`;
  
          // Run the 1st query
          db.pool.query(deleteOrders, [orderId], function(error, rows, fields){
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


/////////
// PUT // - Update data 
////////





/* ----------------------------------*/
/* ------------ LISTENER ------------*/
/* ----------------------------------*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});
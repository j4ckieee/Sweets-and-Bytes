// App.js

/* ---------- SETUP ----------*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 8463;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// app.js

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


/* ---------- ROUTES ----------*/
// app.js

app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });  

app.get('/orders', function(req, res)
    {
        res.render('orders');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    }); 

app.get('/products', function(req, res)
    {
        res.render('products');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    }); 


app.get('/customers', function(req, res)
    {  
        let query1 = "SELECT * FROM Customers;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('customers', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query



app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    /// Capture NULL values
    // let homeworld = parseInt(data['input-homeworld']);
    // if (isNaN(homeworld))
    // {
    //     homeworld = 'NULL'
    // }

    // let age = parseInt(data['input-age']);
    // if (isNaN(age))
    // {
    //     age = 'NULL'
    // }

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (first_name, last_name, email, phone_number) VALUES ('${data['input-first_name']}', '${data['input-last_name']}', ${data['input-email']}, ${data['input-phone_number']})`;
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
            res.redirect('/');
        }
    })
})

// app.delete('/delete-customer-ajax/', function(req,res,next){
//     let data = req.body;
//     let customer_id = parseInt(data.id);
//     let deleteCustomer = `DELETE FROM Customers WHERE customer_id = ?`;

//           // Run the 1st query
//           db.pool.query(deleteCustomer, [customer_id], function(error, rows, fields){
//               if (error) {
  
//               // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
//               console.log(error);
//               res.sendStatus(400);
//               }
  
//   })});

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

/* ---------- LISTENER ----------*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
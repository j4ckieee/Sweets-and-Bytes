-- Active: 1713144842216@@classmysql.engr.oregonstate.edu@3306@cs340_tramn
-- Ngan Kim Tram and Jacqueline Truong (Group 64)
-- Sweets & Bytes Bakery
-- CS340
-- Data Manipulation Queries

------------ Customers ------------
-- Get all attributes in Customers table
SELECT customer_id as 'Customer ID',
CONCAT(first_name,' ',last_name) as 'Name',
-- first_name as 'First Name',
-- last_name as 'Last Name',
phone_number as 'Phone Number',
email as 'Email'
from `Customers`;

-- Add a new customer
INSERT INTO `Customers` (first_name, last_name, phone_number, email) VALUES
(:input-first_name, :input-last_name, :input-phone_number, :input-email);



------------ Products ------------
-- Get all attributes in Products table
SELECT
product_id as 'Product ID',
product_name as 'Product',
product_description as 'Description',
product_price as 'Price per Item',
product_inventory as 'Inventory'
from `Products`;

-- Add a new product
INSERT INTO `Products` (product_name, product_description, product_price, product_inventory)
VALUES (:input-product_name, :input-product_description, :input-product_price, :input-product_inventory);

------------ Orders ------------
-- Get all attributes in Orders table
SELECT
`Order_Products`.order_id as 'Order ID',
CONCAT(Customers.first_name, ' ', `Customers`.last_name) as 'Customer',
Orders.order_date as 'Order Date',
sum((`Order_Products`.product_ordered_qt) * (Products.product_price)) as 'Subtotal'
FROM `Order_Products`
INNER JOIN Orders ON Orders.order_id = `Order_Products`.order_id
INNER JOIN `Customers` ON `Orders`.customer_id = `Customers`.customer_id
INNER JOIN `Products` ON Order_Products.product_id = Products.product_id
GROUP BY `Order_Products`.order_id;

-- Add a new order
INSERT INTO `Orders` (customer_id, order_date)
VALUES (
    (SELECT Customers.customer_id
    FROM `Customers`
    WHERE Customers.first_name = :input-first_name and `Customers`.last_name = :input-last_name(,
    :input-order_date)
);


------------ Order_Products ------------
-- Get all attributes in Order_Products table
SELECT
`Orders`.order_id as 'Order ID',
Products.product_name as 'Product',
`Order_Products`.product_ordered_qt as 'Quantity',
Products.product_price as 'Unit Price',
((`Order_Products`.product_ordered_qt) * (Products.product_price)) as 'Total'
from `Orders`
INNER JOIN `Customers` ON Orders.customer_id = `Customers`.customer_id
INNER JOIN Order_Products ON Orders.order_id = `Order_Products`.order_id
INNER JOIN `Products` ON Order_Products.product_id = Products.product_id;

-- Add a new order_product
INSERT INTO `Order_Products` (order_id, product_id, product_ordered_qt)



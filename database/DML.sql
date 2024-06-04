-- Active: 1713144842216@@classmysql.engr.oregonstate.edu@3306@cs340_tramn
-- Ngan Kim Tram and Jacqueline Truong
-- CS340 - Group 64
-- Sweets & Bytes Bakery

-- Data Manipulation Queries

------------ Customers ------------
-- Get all attributes in Customers table
SELECT customer_id as 'Customer ID',
-- CONCAT(first_name,' ',last_name) as 'Name',
first_name as 'First Name',
last_name as 'Last Name',
phone_number as 'Phone Number',
email as 'Email'
from `Customers`
ORDER BY customer_id ASC;

-- Add a new customer
INSERT INTO `Customers` (first_name, last_name, phone_number, email) VALUES
(:input-first_name, :input-last_name, :input-phone_number, :input-email);

-- Delete an existing customer
DELETE from `Customers` WHERE
first_name = :input-first_name and last_name = :input-last_name;

-- Update an existing customer
UPDATE `Customers` SET first_name = :input-first_name, last_name = :input-last_name, phone_number = :input-phone_number, email = :input-email
WHERE customer_id = :input-customer_id;


------------ Products ------------
-- Get all attributes in Products table
SELECT
product_id as 'Product ID',
product_name as 'Product',
product_description as 'Description',
product_price as 'Price per Item',
product_inventory as 'Inventory'
from `Products`
ORDER BY product_id ASC;

-- Add a new product
INSERT INTO `Products` (product_name, product_description, product_price, product_inventory) VALUES
(:input-product_name, :input-product_description, :input-product_price, :input-product_inventory);

-- Delete an existing product
DELETE FROM `Products` WHERE product_name = :input-product_name;

-- Update unit price and inventory quantity of an existing product
UPDATE `Products`
SET product_price = :input-product_price, product_inventory = :input-product_inventory
WHERE product_name = :input-product_name;


------------ Orders ------------
-- Get all attributes in Orders table
SELECT *,
        Orders.order_id as 'orderID',
        COALESCE(sum((Order_Products.product_ordered_qt) * (Products.product_price)), 0) as 'subtotal'
        FROM Orders
        LEFT JOIN Order_Products ON Orders.order_id = Order_Products.order_id
        LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id
        LEFT JOIN Products ON Order_Products.product_id = Products.product_id
        GROUP BY Orders.order_id
        ORDER BY Orders.order_id ASC;

--Dropdown for Customers
SELECT * FROM Customers;

-- Add a new order
INSERT INTO `Orders` (customer_id, order_date) VALUES
    ((SELECT Customers.customer_id
    FROM `Customers`
    WHERE Customers.first_name = :input-first_name and `Customers`.last_name = :input-last_name),
    :input-order_date);


------------ Order_Products ------------
-- Get all attributes in Order_Products table

SELECT
    *,
    ((Order_Products.product_ordered_qt) * (Products.product_price)) as 'total'
    from Order_Products
    LEFT JOIN Orders ON Orders.order_id = Order_Products.order_id
    LEFT JOIN Products ON Order_Products.product_id = Products.product_id
    LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id
    ORDER BY Orders.order_id ASC;

-- Dropdown for Products
SELECT * FROM Products;

-- Dropdown for OrderID, Customer Name, Order Date
SELECT *,
    Orders.order_id as 'orderID',
    COALESCE(sum((Order_Products.product_ordered_qt) * (Products.product_price)), 0) as 'subtotal'
    FROM Orders
    LEFT JOIN Order_Products ON Orders.order_id = Order_Products.order_id
    LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id
    LEFT JOIN Products ON Order_Products.product_id = Products.product_id
    GROUP BY Orders.order_id
    ORDER BY Orders.order_id ASC;

-- Add a new order_product to an order, also update the product inventory
INSERT INTO `Order_Products` (order_id, product_id, product_ordered_qt) VALUES(
    :input-order_id,
    (SELECT product_id FROM `Products` WHERE product_name = :input-product_name),
    :input-product_ordered_qt
    );

UPDATE `Products` SET product_inventory = (product_inventory - :input-product_ordered_qt)
WHERE product_id = (SELECT product_id FROM `Products` WHERE product_name = :input-product_name);


-- Delete an existing order_product line item in an order
DELETE FROM `Order_Products` WHERE order_id = :input-order_id and product_id = (SELECT product_id FROM `Products` WHERE product_name = :input-product_name);

-- Update the quantity in an existing order_product line item in an order
Update Order_Products SET product_ordered_qt = :input-product_ordered_qt
WHERE order_id = :input-order_id and product_id = (SELECT product_id FROM `Products` WHERE product_name = :input-product_name);


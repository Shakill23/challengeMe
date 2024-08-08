import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connection as db } from './config/index.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express app
const app = express();
const port = +process.env.PORT || 4000;

// Middleware
app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    express.static(path.join(__dirname, 'static'))
);

// Endpoint to send index.html
app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './static/html/index.html'));
});

// Get all users
app.get('/users', (req, res) => {
    try {
        const strQry = `
        SELECT userName, userSurname, userAge, userEmail
        FROM Users
        `;
        db.query(strQry, (err, results) => {
            if (err) throw new Error('Unable to fetch all users');
            res.json({
                status: res.statusCode,
                results
            });
        });
    } catch (e) {
        res.status(404).json({
            status: 404,
            msg: e.message
        });
    }
});

// Get user by ID
app.get('/user/:id', (req, res) => {
    try {
        const strQry = `
        SELECT userName, userSurname, userAge, userEmail
        FROM Users
        WHERE userID = ?
        `;
        db.query(strQry, [req.params.id], (err, result) => {
            if (err) throw new Error('Issue when retrieving a user');
            res.json({
                status: res.statusCode,
                result
            });
        });
    } catch (e) {
        res.status(404).json({
            status: 404,
            msg: e.message
        });
    }
});

// Register a new user
app.post('/register', (req, res) => {
    const { userName, userSurname, userAge, userEmail, userPwd } = req.body;
    const strQry = `
    INSERT INTO Users (userName, userSurname, userAge, userEmail, userPwd)
    VALUES (?, ?, ?, ?, ?)
    `;
    db.query(strQry, [userName, userSurname, userAge, userEmail, userPwd], (err, result) => {
        if (err) throw new Error('Unable to register user');
        res.status(201).json({
            status: res.statusCode,
            message: 'User registered successfully',
            userId: result.insertId
        });
    });
});

// Update user by ID
app.patch('/user/:id', (req, res) => {
    const { userName, userSurname, userAge, userEmail, userPwd } = req.body;
    const strQry = `
    UPDATE Users
    SET userName = ?, userSurname = ?, userAge = ?, userEmail = ?, userPwd = ?
    WHERE userID = ?
    `;
    db.query(strQry, [userName, userSurname, userAge, userEmail, userPwd, req.params.id], (err, result) => {
        if (err) throw new Error('Unable to update user');
        res.json({
            status: res.statusCode,
            message: 'User updated successfully'
        });
    });
});

// Delete user by ID
app.delete('/user/:id', (req, res) => {
    const strQry = `
    DELETE FROM Users
    WHERE userID = ?
    `;
    db.query(strQry, [req.params.id], (err, result) => {
        if (err) throw new Error('Unable to delete user');
        res.json({
            status: res.statusCode,
            message: 'User deleted successfully'
        });
    });
});

// Get all products
app.get('/products', (req, res) => {
    try {
        const strQry = `
        SELECT prodID, prodName, prodQuantity, prodPrice, prodURL
        FROM Products
        `;
        db.query(strQry, (err, results) => {
            if (err) throw new Error('Unable to fetch all products');
            res.json({
                status: res.statusCode,
                results
            });
        });
    } catch (e) {
        res.status(404).json({
            status: 404,
            msg: e.message
        });
    }
});

// Get product by ID
app.get('/product/:id', (req, res) => {
    try {
        const strQry = `
        SELECT prodID, prodName, prodQuantity, prodPrice, prodURL
        FROM Products
        WHERE prodID = ?
        `;
        db.query(strQry, [req.params.id], (err, result) => {
            if (err) throw new Error('Issue when retrieving a product');
            res.json({
                status: res.statusCode,
                result
            });
        });
    } catch (e) {
        res.status(404).json({
            status: 404,
            msg: e.message
        });
    }
});

// Add a new product
app.post('/addProduct', (req, res) => {
    const { prodName, prodQuantity, prodPrice, prodURL, userID } = req.body;
    const strQry = `
    INSERT INTO Products (prodName, prodQuantity, prodPrice, prodURL, userID)
    VALUES (?, ?, ?, ?, ?)
    `;
    db.query(strQry, [prodName, prodQuantity, prodPrice, prodURL, userID], (err, result) => {
        if (err) throw new Error('Unable to add product');
        res.status(201).json({
            status: res.statusCode,
            message: 'Product added successfully',
            productId: result.insertId
        });
    });
});

// Update product by ID
app.patch('/product/:id', (req, res) => {
    const { prodName, prodQuantity, prodPrice, prodURL } = req.body;
    const strQry = `
    UPDATE Products
    SET prodName = ?, prodQuantity = ?, prodPrice = ?, prodURL = ?
    WHERE prodID = ?
    `;
    db.query(strQry, [prodName, prodQuantity, prodPrice, prodURL, req.params.id], (err, result) => {
        if (err) throw new Error('Unable to update product');
        res.json({
            status: res.statusCode,
            message: 'Product updated successfully'
        });
    });
});

// Delete product by ID
app.delete('/product/:id', (req, res) => {
    const strQry = `
    DELETE FROM Products
    WHERE prodID = ?
    `;
    db.query(strQry, [req.params.id], (err, result) => {
        if (err) throw new Error('Unable to delete product');
        res.json({
            status: res.statusCode,
            message: 'Product deleted successfully'
        });
    });
});

// Default endpoint for undefined routes
app.get('*', (req, res) => {
    res.status(404).json({ status: 'error', msg: 'Resource not found' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

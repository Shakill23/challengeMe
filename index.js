import express from 'express';
import path from 'path';
import { connection as db } from './config/index.js';
import { createToken, authenticateToken } from './middleware/AuthenticateUser.js';
import 'dotenv/config';

// Express app
const app = express();
const port = +process.env.PORT || 4000;

// Middleware
app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    express.static(path.join(__dirname, 'static'))
);

// Endpoint: send index.html
app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve('./static/html/index.html'));
})

// Endpoint: display all users
app.get('/users', (req, res) => {
    const strQry = 'SELECT * FROM Users';
    db.query(strQry, (err, results) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(200).json({ status: 'success', results });
    })
})

// Endpoint: display a user based on the primary key
app.get('/user/:id', (req, res) => {
    const strQry = 'SELECT * FROM Users WHERE userID = ?';
    db.query(strQry, [req.params.id], (err, result) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(200).json({ status: 'success', result });
    })
})

// Endpoint: add a user to the database
app.post('/register', (req, res) => {
    const { userName, userSurname, userAge, userEmail, userPwd } = req.body;
    const strQry = 'INSERT INTO Users (userName, userSurname, userAge, userEmail, userPwd) VALUES (?, ?, ?, ?, ?)';
    db.query(strQry, [userName, userSurname, userAge, userEmail, userPwd], (err, result) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(201).json({ status: 'success', result });
    })
})

// Endpoint: update a user
app.patch('/user/:id', (req, res) => {
    const { userName, userSurname, userAge, userEmail, userPwd } = req.body;
    const strQry = 'UPDATE Users SET userName = ?, userSurname = ?, userAge = ?, userEmail = ?, userPwd = ? WHERE userID = ?';
    db.query(strQry, [userName, userSurname, userAge, userEmail, userPwd, req.params.id], (err, result) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(200).json({ status: 'success', result });
    })
})

// Endpoint: delete a specific user
app.delete('/user/:id', (req, res) => {
    const strQry = 'DELETE FROM Users WHERE userID = ?';
    db.query(strQry, [req.params.id], (err, result) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(200).json({ status: 'success', result });
    })
})

// Endpoint: display all products
app.get('/products', (req, res) => {
    const strQry = 'SELECT * FROM Products';
    db.query(strQry, (err, results) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(200).json({ status: 'success', results });
    })
})

// Endpoint: display a product based on the primary key
app.get('/product/:id', (req, res) => {
    const strQry = 'SELECT * FROM Products WHERE prodID = ?';
    db.query(strQry, [req.params.id], (err, result) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(200).json({ status: 'success', result });
    })
})

// Endpoint: add a product to the database
app.post('/addProduct', (req, res) => {
    const { prodName, prodQuantity, prodPrice, prodURL, userID } = req.body;
    const strQry = 'INSERT INTO Products (prodName, prodQuantity, prodPrice, prodURL, userID) VALUES (?, ?, ?, ?, ?)';
    db.query(strQry, [prodName, prodQuantity, prodPrice, prodURL, userID], (err, result) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(201).json({ status: 'success', result });
    })
})

// Endpoint: update a product
app.patch('/product/:id', (req, res) => {
    const { prodName, prodQuantity, prodPrice, prodURL, userID } = req.body;
    const strQry = 'UPDATE Products SET prodName = ?, prodQuantity = ?, prodPrice = ?, prodURL = ?, userID = ? WHERE prodID = ?';
    db.query(strQry, [prodName, prodQuantity, prodPrice, prodURL, userID, req.params.id], (err, result) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(200).json({ status: 'success', result });
    })
})

// Endpoint: delete a specific product
app.delete('/product/:id', (req, res) => {
    const strQry = 'DELETE FROM Products WHERE prodID = ?';
    db.query(strQry, [req.params.id], (err, result) => {
        if (err) res.status(500).json({ status: 'error', msg: err.message });
        res.status(200).json({ status: 'success', result });
    })
})

// Default endpoint for undefined routes
app.get('*', (req, res) => {
    res.status(404).json({ status: 'error', msg: 'Resource not found' });
})

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

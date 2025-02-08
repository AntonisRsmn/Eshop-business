const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const ordersFilePath = path.join(__dirname, 'orders.json');

// Serve static files from the root directory
app.use(express.static(__dirname));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle order submissions
app.post('/submit-order', (req, res) => {
    const newOrder = req.body;

    fs.readFile(ordersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading orders file:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        let orders = JSON.parse(data);
        const existingOrderIndex = orders.findIndex(order => order.email === newOrder.email);

        if (existingOrderIndex !== -1) {
            // Update existing order
            orders[existingOrderIndex] = {
                ...orders[existingOrderIndex],
                ...newOrder,
                orderNumber: newOrder.orderNumber,
                orderTotal: newOrder.orderTotal
            };
        } else {
            // Add new order
            orders.push({
                customerNumber: newOrder.customerNumber,
                firstName: newOrder.firstName,
                lastName: newOrder.lastName,
                email: newOrder.email,
                address: newOrder.address,
                city: newOrder.city,
                country: newOrder.country,
                zip: newOrder.zip,
                cardNumber: newOrder.cardNumber,
                expiryDate: newOrder.expiryDate,
                cvv: newOrder.cvv,
                orderNumber: newOrder.orderNumber,
                orderTotal: newOrder.orderTotal
            });
        }

        fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                console.error('Error writing to orders file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(200).json({ message: 'Order placed successfully!' });
        });
    });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

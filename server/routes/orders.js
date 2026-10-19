const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// POST /api/orders - Place a new order from current cart items (ORD-1)
router.post('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const { shipping_name, shipping_phone, shipping_address } = req.body;

    if (!shipping_name || !shipping_phone || !shipping_address) {
        return res.status(400).json({ error: 'All shipping details are required.' });
    }

    // 1. Fetch user's cart items with product details and current stock
    const cartQuery = `
        SELECT cart_items.product_id, cart_items.quantity, products.price, products.stock, products.name 
        FROM cart_items 
        JOIN products ON cart_items.product_id = products.id 
        WHERE cart_items.user_id = ?
    `;

    db.all(cartQuery, [userId], (err, items) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Your cart is empty.' });
        }

        // 2. Validate stock levels for every item before confirming
        for (let item of items) {
            if (item.quantity > item.stock) {
                return res.status(400).json({ error: `Insufficient stock for product: ${item.name}` });
            }
        }

        let totalAmount = 0;
        items.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        // 3. Insert into orders table
        const orderQuery = `
            INSERT INTO orders (user_id, total_amount, shipping_name, shipping_phone, shipping_address, payment_method) 
            VALUES (?, ?, ?, ?, ?, 'COD')
        `;

        db.run(orderQuery, [userId, totalAmount, shipping_name, shipping_phone, shipping_address], function(err) {
            if (err) return res.status(500).json({ error: err.message });

            const orderId = this.lastID;

            // 4. Insert order items (snapshot pricing) and update product stock
            let completedItems = 0;
            let hasError = false;

            items.forEach(item => {
                const orderItemQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
                    VALUES (?, ?, ?, ?)
                `;
                db.run(orderItemQuery, [orderId, item.product_id, item.quantity, item.price], (itemErr) => {
                    if (itemErr) hasError = true;
                });

                const updateStockQuery = `
                    UPDATE products SET stock = stock - ? WHERE id = ?
                `;
                db.run(updateStockQuery, [item.quantity, item.product_id], (stockErr) => {
                    if (stockErr) hasError = true;

                    completedItems++;
                    if (completedItems === items.length) {
                        if (hasError) {
                            return res.status(500).json({ error: 'Error processing order items.' });
                        }

                        // 5. Clear user's cart items once order is successfully placed
                        db.run('DELETE FROM cart_items WHERE user_id = ?', [userId], (clearErr) => {
                            if (clearErr) {
                                console.error('Error clearing cart:', clearErr.message);
                            }
                            res.status(201).json({ 
                                message: 'Order placed successfully!', 
                                orderId, 
                                totalAmount 
                            });
                        });
                    }
                });
            });
        });
    });
});

// GET /api/orders - Get order history for the logged-in user (ORD-3)
router.get('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const query = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
    
    db.all(query, [userId], (err, orders) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ orders });
    });
});

module.exports = router;
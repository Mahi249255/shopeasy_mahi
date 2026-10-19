const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// GET /api/cart - Get user's cart items with grand total (CRT-2)
router.get('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const query = `
        SELECT cart_items.id as cart_item_id, cart_items.quantity, 
               products.id as product_id, products.name, products.price, products.stock, products.image_url 
        FROM cart_items 
        JOIN products ON cart_items.product_id = products.id 
        WHERE cart_items.user_id = ?
    `;
    db.all(query, [userId], (err, items) => {
        if (err) return res.status(500).json({ error: err.message });
        
        let grandTotal = 0;
        items.forEach(item => {
            grandTotal += item.price * item.quantity;
        });

        res.json({ items, grandTotal });
    });
});

// POST /api/cart - Add item to cart (CRT-1)
router.post('/', verifyToken, (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ error: 'Product ID is required.' });

    // Check available stock first (PRD-7)
    db.get('SELECT stock FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) return res.status(404).json({ error: 'Product not found.' });

        // Check if item is already in user's cart
        db.get('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId], (err, existing) => {
            if (existing) {
                const newQty = existing.quantity + quantity;
                if (newQty > product.stock) {
                    return res.status(400).json({ error: 'Cannot exceed available stock.' });
                }
                db.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing.id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Cart updated successfully.' });
                });
            } else {
                if (quantity > product.stock) {
                    return res.status(400).json({ error: 'Cannot exceed available stock.' });
                }
                db.run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity], function(err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'Product added to cart.', cartItemId: this.lastID });
                });
            }
        });
    });
});

// PUT /api/cart/:itemId - Update item quantity (CRT-3)
router.put('/:itemId', verifyToken, (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be at least 1.' });
    }

    const query = `
        SELECT cart_items.*, products.stock 
        FROM cart_items 
        JOIN products ON cart_items.product_id = products.id 
        WHERE cart_items.id = ? AND cart_items.user_id = ?
    `;
    db.get(query, [itemId, userId], (err, item) => {
        if (err || !item) return res.status(404).json({ error: 'Cart item not found.' });

        if (quantity > item.stock) {
            return res.status(400).json({ error: 'Quantity exceeds available stock.' });
        }

        db.run('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Cart quantity updated.' });
        });
    });
});

// DELETE /api/cart/:itemId - Remove item from cart (CRT-4)
router.delete('/:itemId', verifyToken, (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;

    db.run('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [itemId, userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Cart item not found.' });
        res.json({ message: 'Item removed from cart.' });
    });
});

module.exports = router;
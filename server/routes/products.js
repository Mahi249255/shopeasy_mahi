const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// GET /api/products - List products with optional search and category filters (PRD-1, PRD-2, PRD-3)[span_6](start_span)[span_6](end_span)
router.get('/', (req, res) => {
    let { search, category } = req.query;
    let query = 'SELECT * FROM products WHERE is_active = 1';
    let params = [];

    if (search) {
        query += ' AND name LIKE ?';
        params.push(`%${search}%`);
    }

    if (category) {
        query += ' AND category_id = ?';
        params.push(category);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ products: rows });
    });
});

// GET /api/categories - List all categories[span_7](start_span)[span_7](end_span)
router.get('/categories', (req, res) => {
    db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ categories: rows });
    });
});

// GET /api/products/:id - Get single product details (PRD-6)[span_8](start_span)[span_8](end_span)
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err || !product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        res.json({ product });
    });
});

// POST /api/products - Create a new product (Admin only, ADM-2)[span_9](start_span)[span_9](end_span)
router.post('/', verifyToken, adminOnly, (req, res) => {
    const { category_id, name, description, price, stock, image_url } = req.body;

    if (!name || price === undefined || stock === undefined) {
        return res.status(400).json({ error: 'Name, price, and stock are required.' });
    }

    const query = `INSERT INTO products (category_id, name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [category_id, name, description, price, stock, image_url || ''], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Product created successfully!', productId: this.lastID });
    });
});

module.exports = router;
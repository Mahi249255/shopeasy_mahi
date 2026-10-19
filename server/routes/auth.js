const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const verifyToken = require('../middleware/auth');

// REGISTER API
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || password.length < 6) {
        return res.status(400).json({ error: 'Name, email, and password (min 6 chars) are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (name, email, password_hash, phone, address) VALUES (?, ?, ?, ?, ?)`;
        
        db.run(query, [name, email, hashedPassword, phone || '', address || ''], function(err) {
            if (err) {
                return res.status(400).json({ error: 'Email already exists or invalid data.' });
            }
            res.status(201).json({ message: 'User registered successfully!', userId: this.lastID });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// LOGIN API
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'supersecret_shopeasy_jwt_key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    });
});

// GET CURRENT USER PROFILE
router.get('/me', verifyToken, (req, res) => {
    db.get(`SELECT id, name, email, role, phone, address FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ user });
    });
});

module.exports = router;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create/Connect to SQLite database file inside the server folder
const dbPath = path.resolve(__dirname, 'shop.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Automatically run schema.sql to initialize tables
const schemaPath = path.resolve(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

db.exec(schemaSql, (err) => {
    if (err) {
        console.error('Error executing schema:', err.message);
    } else {
        console.log('Database tables verified and ready.');

        // Check if products table is empty, then run seed.sql automatically
        db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
            if (!err && row && row.count === 0) {
                const seedPath = path.resolve(__dirname, 'seed.sql');
                if (fs.existsSync(seedPath)) {
                    const seedSql = fs.readFileSync(seedPath, 'utf8');
                    db.exec(seedSql, (seedErr) => {
                        if (seedErr) {
                            console.error('Error executing seed data:', seedErr.message);
                        } else {
                            console.log('Sample seed data inserted successfully!');
                        }
                    });
                }
            }
        });
    }
});

module.exports = db;
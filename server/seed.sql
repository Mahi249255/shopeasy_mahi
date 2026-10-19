INSERT OR IGNORE INTO categories (id, name) VALUES (1, 'Electronics');
INSERT OR IGNORE INTO categories (id, name) VALUES (2, 'Apparel');
INSERT OR IGNORE INTO categories (id, name) VALUES (3, 'Home & Kitchen');

INSERT OR IGNORE INTO products (id, category_id, name, description, price, stock, image_url, is_active) VALUES 
(1, 1, 'Wireless Mouse', 'Ergonomic wireless mouse with USB receiver and smooth tracking.', 79900, 25, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400', 1),
(2, 1, 'Mechanical Keyboard', 'RGB backlit mechanical gaming keyboard with tactile switches.', 299900, 10, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 1),
(3, 2, 'Cotton T-Shirt', '100% comfortable breathable cotton casual t-shirt.', 49900, 50, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400', 1),
(4, 1, 'HD Monitor', '24-inch Full HD IPS display monitor with thin bezels.', 1199900, 5, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 1),
(5, 3, 'Stainless Steel Water Bottle', 'Insulated vacuum flask keeps drinks cold for 24 hours.', 89900, 30, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 1);
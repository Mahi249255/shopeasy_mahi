# 🛍️ ShopEasy - E-Commerce Web Application (MVP)

ShopEasy is a full-stack Minimum Viable Product (MVP) e-commerce web application built from scratch using HTML, CSS, JavaScript, Node.js, Express, and SQLite[span_0](start_span)[span_0](end_span). It enables customers to browse products, manage a shopping cart, and place Cash on Delivery (COD) orders, while allowing administrators to manage products, categories, and order statuses[span_1](start_span)[span_1](end_span).

---

## 🛠️ Tech Stack & Technologies
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (responsive layouts using Flexbox/CSS Grid)[span_2](start_span)[span_2](end_span)
* **Backend:** Node.js, Express.js (REST APIs, JSON responses, middleware)[span_3](start_span)[span_3](end_span)
* **Database:** SQLite (single `.db` file with normalized relational schema)[span_4](start_span)[span_4](end_span)
* **Security:** bcrypt for password hashing, JSON Web Tokens (JWT) for secure authentication[span_5](start_span)[span_5](end_span)

---

## 📂 Project Deliverables
* **Source Code:** Hosted in this GitHub repository (`shopeasy_mahi`) with regular version control commits[span_6](start_span)[span_6](end_span).
* **Database Files:** 
  * `server/schema.sql` (Relational table structures for users, categories, products, cart_items, orders, and order_items)[span_7](start_span)[span_7](end_span)
  * `server/seed.sql` (Sample data including categories, products, and an admin user)[span_8](start_span)[span_8](end_span)

---

## ✨ Key Features & Scope

### 👤 Customer Features
* **Authentication:** Secure user registration, password hashing, and login yielding JWT tokens[span_9](start_span)[span_9](end_span).
* **Product Catalog:** Responsive grid displaying products with search capability and category filters[span_10](start_span)[span_10](end_span).
* **Shopping Cart:** Add items, update quantities (bounded by available stock), remove items, and view grand totals[span_11](start_span)[span_11](end_span).
* **Checkout & Orders:** Collect shipping details, place Cash on Delivery (COD) orders, and view past order status history[span_12](start_span)[span_12](end_span).

### 🛠️ Admin Features
* **Product Management:** Add, edit, or delete products with complete details[span_13](start_span)[span_13](end_span).
* **Category Management:** Add, edit, or delete categories[span_14](start_span)[span_14](end_span).
* **Order Processing:** View all customer orders and update delivery status (Placed ➔ Shipped ➔ Delivered)[span_15](start_span)[span_15](end_span).

---

## 🔌 REST API Specification

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new user | Public[span_16](start_span)[span_16](end_span) |
| **POST** | `/api/auth/login` | Login and return JWT | Public[span_17](start_span)[span_17](end_span) |
| **GET** | `/api/auth/me` | Current user info | Logged in[span_18](start_span)[span_18](end_span) |
| **GET** | `/api/products` | List products (search, category, page, sort) | Public[span_19](start_span)[span_19](end_span) |
| **GET** | `/api/products/:id` | Product details | Public[span_20](start_span)[span_20](end_span) |
| **POST** | `/api/products` | Create product | Admin[span_21](start_span)[span_21](end_span) |
| **PUT** | `/api/products/:id` | Update product | Admin[span_22](start_span)[span_22](end_span) |
| **DELETE**| `/api/products/:id` | Delete/deactivate product | Admin[span_23](start_span)[span_23](end_span) |
| **GET** | `/api/categories` | List categories | Public[span_24](start_span)[span_24](end_span) |
| **GET** | `/api/cart` | Get cart with totals | Customer[span_25](start_span)[span_25](end_span) |
| **POST** | `/api/cart` | Add item to cart | Customer[span_26](start_span)[span_26](end_span) |
| **PUT** | `/api/cart/:itemId` | Update cart quantity | Customer[span_27](start_span)[span_27](end_span) |
| **DELETE**| `/api/cart/:itemId` | Remove item from cart | Customer[span_28](start_span)[span_28](end_span) |
| **POST** | `/api/orders` | Place order from cart (checkout) | Customer[span_29](start_span)[span_29](end_span) |
| **GET** | `/api/orders` | My orders history | Customer[span_30](start_span)[span_30](end_span) |
| **GET** | `/api/admin/orders` | All customer orders | Admin[span_31](start_span)[span_31](end_span) |
| **PATCH**| `/api/admin/orders/:id/status` | Update order status | Admin[span_32](start_span)[span_32](end_span) |

---

## ⚙️ Local Installation & Setup

Follow these steps to run the application locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Mahi249255/shopeasy_mahi.git](https://github.com/Mahi249255/shopeasy_mahi.git)
   cd shopeasy_mahi
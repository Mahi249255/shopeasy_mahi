document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

async function fetchProducts(searchQuery = "", categoryId = "") {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "<p>Loading products...</p>";

    try {
        let url = "http://localhost:5000/api/products?";
        const params = new URLSearchParams();
        
        if (searchQuery) params.append("search", searchQuery);
        if (categoryId) params.append("category", categoryId);

        const response = await fetch(url + params.toString());
        const data = await response.json();

        if (!data.products || data.products.length === 0) {
            grid.innerHTML = "<p>No products found matching your criteria.</p>";
            return;
        }

        grid.innerHTML = "";
        data.products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            
            const formattedPrice = (product.price / 100).toFixed(2);

            card.innerHTML = `
                <div class="product-info">
                    <img src="${product.image_url || 'https://via.placeholder.com/300'}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${formattedPrice}</p>
                </div>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        grid.innerHTML = "<p>Failed to connect to server.</p>";
    }
}

function filterProducts() {
    const searchInput = document.getElementById("search-input").value;
    const categorySelect = document.getElementById("category-select").value;
    fetchProducts(searchInput, categorySelect);
}

async function addToCart(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first before adding items to your cart!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Product added to cart successfully!");
        } else {
            alert(data.error || "Failed to add product to cart.");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Network error. Could not add to cart.");
    }
}
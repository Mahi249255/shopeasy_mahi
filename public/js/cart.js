document.addEventListener("DOMContentLoaded", () => {
    fetchCart();
});

async function fetchCart() {
    const token = localStorage.getItem("token");
    const container = document.getElementById("cart-container");

    if (!token) {
        container.innerHTML = `<p>Please <a href="login.html">login</a> to view your shopping cart.</p>`;
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/cart", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            container.innerHTML = `<p>Your cart is empty. <a href="index.html">Explore products</a></p>`;
            return;
        }

        let html = `
            <table style="width:100%; border-collapse: collapse; background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <thead>
                    <tr style="background-color: #2c3e50; color: white; text-align: left;">
                        <th style="padding: 12px;">Product</th>
                        <th style="padding: 12px;">Price</th>
                        <th style="padding: 12px;">Quantity</th>
                        <th style="padding: 12px;">Total</th>
                        <th style="padding: 12px;">Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.items.forEach(item => {
            const unitPrice = (item.price / 100).toFixed(2);
            const lineTotal = ((item.price * item.quantity) / 100).toFixed(2);
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px; display:flex; align-items:center; gap:10px;">
                        <img src="${item.image_url || 'https://via.placeholder.com/50'}" width="50" height="50" style="object-fit:cover; border-radius:4px;">
                        <span>${item.name}</span>
                    </td>
                    <td style="padding: 12px;">₹${unitPrice}</td>
                    <td style="padding: 12px;">
                        <button onclick="updateQty(${item.cart_item_id}, ${item.quantity - 1})" style="padding:2px 8px;">-</button>
                        <span style="margin: 0 10px; font-weight:bold;">${item.quantity}</span>
                        <button onclick="updateQty(${item.cart_item_id}, ${item.quantity + 1})" style="padding:2px 8px;">+</button>
                    </td>
                    <td style="padding: 12px; font-weight:bold;">₹${lineTotal}</td>
                    <td style="padding: 12px;"><button onclick="removeItem(${item.cart_item_id})" style="background:#e74c3c; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer;">Remove</button></td>
                </tr>
            `;
        });

        const grandTotal = (data.grandTotal / 100).toFixed(2);
        html += `
                </tbody>
            </table>
            <div style="margin-top: 20px; text-align: right;">
                <h2>Grand Total: ₹${grandTotal}</h2>
                <button class="btn" onclick="window.location.href='checkout.html'" style="font-size: 1.1rem; padding: 12px 24px;">Proceed to Checkout</button>
            </div>
        `;

        container.innerHTML = html;
    } catch (error) {
        console.error("Error fetching cart:", error);
        container.innerHTML = `<p>Failed to load your cart.</p>`;
    }
}

async function updateQty(itemId, newQty) {
    if (newQty < 1) return;
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: newQty })
        });
        if (response.ok) {
            fetchCart();
        } else {
            const err = await response.json();
            alert(err.error || "Failed to update quantity.");
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
    }
}

async function removeItem(itemId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            fetchCart();
        } else {
            alert("Failed to remove item.");
        }
    } catch (error) {
        console.error("Error removing item:", error);
    }
}
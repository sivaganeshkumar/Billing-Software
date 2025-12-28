// Cart Popup Management
function updateCartPopup() {
    const cartPopupItems = document.getElementById('cartPopupItems');
    const cartPopupTotal = document.getElementById('cartPopupTotal');
    
    if (!cartPopupItems) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        cartPopupItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        if (cartPopupTotal) {
            cartPopupTotal.textContent = '₹0';
        }
        return;
    }
    
    cartPopupItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.subtotal;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-popup-item';
        itemDiv.innerHTML = `
            <div class="cart-popup-item-info">
                <div class="cart-popup-item-name">${item.englishName || item.name}</div>
                <div class="cart-popup-item-price">₹${item.price} each</div>
            </div>
            <div class="cart-popup-item-controls">
                <button class="cart-popup-quantity-btn" onclick="cartPopupDecreaseQuantity(${index})">-</button>
                <span class="cart-popup-quantity-value">${item.quantity}</span>
                <button class="cart-popup-quantity-btn" onclick="cartPopupIncreaseQuantity(${index})">+</button>
            </div>
            <div class="cart-popup-item-total">₹${item.subtotal}</div>
        `;
        cartPopupItems.appendChild(itemDiv);
    });
    
    if (cartPopupTotal) {
        cartPopupTotal.textContent = `₹${total}`;
    }
}

// Increase quantity in popup
function cartPopupIncreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart[index]) {
        cart[index].quantity += 1;
        cart[index].subtotal = cart[index].quantity * cart[index].price;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartPopup();
        updateCartBadge();
        
        // Update cart page if it's open
        if (typeof renderCart === 'function') {
            renderCart();
        }
    }
}

// Decrease quantity in popup
function cartPopupDecreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            cart[index].subtotal = cart[index].quantity * cart[index].price;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartPopup();
        updateCartBadge();
        
        // Update cart page if it's open
        if (typeof renderCart === 'function') {
            renderCart();
        }
    }
}

// Initialize popup on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartPopup();
    
    // Update popup when storage changes
    window.addEventListener('storage', () => {
        updateCartPopup();
    });
});

// Update popup on visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateCartPopup();
    }
});

// Make functions globally available
window.cartPopupIncreaseQuantity = cartPopupIncreaseQuantity;
window.cartPopupDecreaseQuantity = cartPopupDecreaseQuantity;
window.updateCartPopup = updateCartPopup;


// Cart Management
let cart = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCart();
    updateCartBadge();
    setupEventListeners();
});

// Load cart from localStorage
function loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) {
        cart = JSON.parse(stored);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Update cart popup if it exists
    if (typeof updateCartPopup === 'function') {
        updateCartPopup();
    }
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        cartTotal.textContent = '₹0';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.subtotal;
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.englishName || item.name}</div>
                <div class="cart-item-price">₹${item.price} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
            </div>
            <div class="cart-item-total">₹${item.subtotal}</div>
        `;
        cartItems.appendChild(cartItemDiv);
    });

    cartTotal.textContent = `₹${total}`;
}

// Increase quantity
function increaseQuantity(index) {
    cart[index].quantity += 1;
    cart[index].subtotal = cart[index].quantity * cart[index].price;
    saveCart();
    renderCart();
}

// Decrease quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        cart[index].subtotal = cart[index].quantity * cart[index].price;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    renderCart();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
        renderCart();
    }
}

// Setup event listeners
function setupEventListeners() {
    const clearCartBtn = document.getElementById('clearCartBtn');
    const payNowBtn = document.getElementById('payNowBtn');
    const printBillBtn = document.getElementById('printBillBtn');
    const closeModal = document.getElementById('closeModal');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    if (payNowBtn) {
        payNowBtn.addEventListener('click', showPaymentModal);
    }

    if (printBillBtn) {
        printBillBtn.addEventListener('click', printBill);
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('paymentModal').style.display = 'none';
        });
    }

    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', confirmPayment);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('paymentModal');
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Show payment modal with QR code
function showPaymentModal() {
    if (cart.length === 0) {
        alert('Cart is empty');
        return;
    }

    const modal = document.getElementById('paymentModal');
    const paymentTotal = document.getElementById('paymentTotal');
    const qrcodeDiv = document.getElementById('qrcode');
    
    if (!modal || !paymentTotal || !qrcodeDiv) return;

    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    paymentTotal.textContent = `₹${total}`;

    // Clear previous QR code
    qrcodeDiv.innerHTML = '';

    // Generate QR code with payment details
    const paymentData = `UPI:GRBHAVANMESS@paytm|Amount:${total}|Ref:${Date.now()}`;
    
    new QRCode(qrcodeDiv, {
        text: paymentData,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    modal.style.display = 'block';
}

// Confirm payment
function confirmPayment() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const salesRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-IN'),
        items: JSON.parse(JSON.stringify(cart)),
        total: total,
        timestamp: Date.now()
    };

    // Save to sales history
    let salesHistory = [];
    const stored = localStorage.getItem('salesHistory');
    if (stored) {
        salesHistory = JSON.parse(stored);
    }
    salesHistory.push(salesRecord);
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

    // Clear cart
    cart = [];
    saveCart();
    renderCart();

    // Close modal
    document.getElementById('paymentModal').style.display = 'none';

    alert('Payment successful!');
}

// Print bill
function printBill() {
    if (cart.length === 0) {
        alert('Cart is empty');
        return;
    }

    const billPrint = document.getElementById('billPrint');
    const billDate = document.getElementById('billDate');
    const billItems = document.getElementById('billItems');
    const billTotalAmount = document.getElementById('billTotalAmount');

    if (!billPrint || !billDate || !billItems || !billTotalAmount) return;

    const now = new Date();
    billDate.innerHTML = `<p><strong>Date:</strong> ${now.toLocaleDateString('en-IN')}</p>
                         <p><strong>Time:</strong> ${now.toLocaleTimeString('en-IN')}</p>`;

    billItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.subtotal;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bill-item';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.englishName || item.name}</strong><br>
                ${item.quantity} x ₹${item.price}
            </div>
            <div>₹${item.subtotal}</div>
        `;
        billItems.appendChild(itemDiv);
    });

    billTotalAmount.textContent = `₹${total}`;

    // Show bill and print
    billPrint.style.display = 'block';
    window.print();
    billPrint.style.display = 'none';
}

// Make functions globally available
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeFromCart = removeFromCart;


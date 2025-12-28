// Cart Badge Update - Shared across all pages
function updateCartBadge() {
    const cartBadges = document.querySelectorAll('#cartBadge');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartBadges.forEach(badge => {
        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
    
    // Also update cart popup if it exists
    if (typeof updateCartPopup === 'function') {
        updateCartPopup();
    }
}

// Update badge on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

// Update badge when storage changes (for cross-page updates)
window.addEventListener('storage', () => {
    updateCartBadge();
});

// Also update on visibility change (when switching tabs)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateCartBadge();
    }
});


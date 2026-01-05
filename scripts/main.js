// Menu and Cart Management
let menuItems = [];
let cart = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    renderMenu();
    updateCartBadge();
    animateLogo();
    // If page has #cart hash on load, smooth scroll to cart
    if (window.location.hash === '#cart') {
        // slight delay to allow layout/DOM paint
        setTimeout(() => {
            const cartEl = document.getElementById('cart');
            if (cartEl) {
                cartEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // focus for accessibility
                cartEl.setAttribute('tabindex', '-1');
                cartEl.focus();
            }
        }, 140);
    }
});

// Smooth-scroll handler for internal cart links
document.addEventListener('click', (e) => {
    try {
        const target = e.target.closest && e.target.closest('a');
        if (!target) return;
        const href = target.getAttribute('href') || '';
        if (href.endsWith('#cart') || href === '#cart') {
            // If link points to cart on current page, prevent default and smooth scroll
            const url = new URL(href, window.location.href);
            if (url.pathname === window.location.pathname) {
                e.preventDefault();
                const cartEl = document.getElementById('cart');
                if (cartEl) {
                    cartEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    cartEl.setAttribute('tabindex', '-1');
                    cartEl.focus();
                }
                // update hash without jumping
                history.replaceState(null, '', '#cart');
            }
        }
    } catch (err) {
        // ignore
    }
});

// Update cart badge (will be handled by cart-badge.js, but keeping for compatibility)
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
}

// Load menu items from localStorage
function loadMenuItems() {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
        menuItems = JSON.parse(stored);
    } else {
        // Initialize with default items
        initializeDefaultMenu();
    }
}

// Initialize default menu items
function initializeDefaultMenu() {
    menuItems = [
        {
            id: '1',
            tamilName: 'Idli',
            englishName: 'Idli (1 Pcs)',
            price: 10,
            imageUrl: 'https://www.bing.com/th/id/OIP.civ6_2NuDZWek0HcFthhkwHaFY?w=237&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
        },
        {
            id: '2',
            tamilName: 'Poori',
            englishName: 'Poori',
            price: 30,
            imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'
        },
        {
            id: '3',
            tamilName: 'Dosa',
            englishName: 'Dosa',
            price: 35,
            imageUrl: 'https://images.unsplash.com/photo-1615826932727-ed9f4ac5f54b?w=400&h=300&fit=crop'
        },
        {
            id: '4',
            tamilName: 'Santhagai',
            englishName: 'Santhagai',
            price: 40,
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'
        },
        {
            id: '5',
            tamilName: 'Meals',
            englishName: 'Meals',
            price: 80,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
        },
        {
            id: '6',
            tamilName: 'Parotta',
            englishName: 'Parotta',
            price: 20,
            imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop'
        }
    ];
    saveMenuItems();
}

// Save menu items to localStorage
function saveMenuItems() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Render menu items
function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';

    if (menuItems.length === 0) {
        menuGrid.innerHTML = '<p class="no-data">No items available</p>';
        return;
    }

    menuItems.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'menu-item';
        menuItemDiv.innerHTML = `
            <img src="${item.imageUrl || 'images/placeholder.jpg'}" alt="${item.englishName}" class="menu-item-image" 
                 onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(item.englishName)}'">
            <div class="menu-item-info">
                <div class="menu-item-name">${item.englishName}</div>
                <div class="menu-item-price">₹${item.price}</div>
            </div>
        `;
        menuItemDiv.addEventListener('click', () => addToCart(item));
        menuGrid.appendChild(menuItemDiv);
    });
}

// Add item to cart
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(cartItem => cartItem.itemId === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
        cart.push({
            itemId: item.id,
            englishName: item.englishName,
            name: item.englishName,
            price: item.price,
            quantity: 1,
            subtotal: item.price
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Update cart popup if it exists
    if (typeof updateCartPopup === 'function') {
        updateCartPopup();
    }
    
    // Show notification
    showAddToCartNotification(item.englishName);
}

// Show add to cart notification
function showAddToCartNotification(itemName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${itemName} added to cart!`;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Animate the logo frame and text (respect reduced motion)
function animateLogo() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = document.querySelector('.logo-frame');
    const logo = document.querySelector('.logo');
    if (!frame || !logo) return;

    if (prefersReduced) {
        frame.classList.add('drawn', 'revealed');
        logo.classList.add('logo-animated');
        return;
    }

    // Ensure classes are removed so animation can run repeatably
    frame.classList.remove('drawn', 'revealed');
    logo.classList.remove('logo-animated');

    // Start draw after a short delay to allow paint
    setTimeout(() => {
        frame.classList.add('drawn');

        // After the frame draw duration, reveal text and sync monogram
        const drawDuration = 820; // matches CSS transition ~800ms
        setTimeout(() => {
            frame.classList.add('revealed');
            logo.classList.add('logo-animated');
        }, drawDuration);
    }, 80);
}

// Keyboard shortcut: press 'L' to replay the logo animation
// - ignores keys when focus is on input/textarea/select or contenteditable
// - ignores if modifier keys (ctrl/meta/alt) are pressed
// - debounced to prevent spamming
(function setupLogoKeyboardShortcut() {
    let lastKeyTime = 0;
    document.addEventListener('keydown', (e) => {
        try {
            if (!e || !e.key) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return; // ignore with modifiers
            const key = e.key.toLowerCase();
            if (key !== 'l') return;
            // ignore repeated keydown when holding key
            if (e.repeat) return;

            const active = document.activeElement;
            if (active) {
                const tag = (active.tagName || '').toLowerCase();
                const isEditable = active.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select';
                if (isEditable) return; // user is typing
            }

            const now = Date.now();
            if (now - lastKeyTime < 900) return; // debounce
            lastKeyTime = now;

            animateLogo();
        } catch (err) {
            // swallow errors to avoid breaking the page
            console.error('Logo shortcut error:', err);
        }
    });

})();

// Make functions globally available
window.addToCart = addToCart;

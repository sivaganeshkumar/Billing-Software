// Menu Management - CRUD Operations
let menuItems = [];
let editingItemId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    renderMenuItems();
    setupEventListeners();
});

// Load menu items from localStorage
function loadMenuItems() {
    const stored = localStorage.getItem('menuItems');
    if (stored) {
        menuItems = JSON.parse(stored);
    } else {
        // Initialize with default items if none exist
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

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('menuForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const tamilName = document.getElementById('tamilName').value.trim();
    const englishName = document.getElementById('englishName').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const imageUrl = document.getElementById('imageUrl').value.trim();

    if (!tamilName || !englishName || isNaN(price) || price < 0) {
        alert('Please fill all fields correctly');
        return;
    }

    if (editingItemId) {
        // Update existing item
        const itemIndex = menuItems.findIndex(item => item.id === editingItemId);
        if (itemIndex !== -1) {
            menuItems[itemIndex] = {
                ...menuItems[itemIndex],
                tamilName,
                englishName,
                price,
                imageUrl: imageUrl || menuItems[itemIndex].imageUrl
            };
            saveMenuItems();
            renderMenuItems();
            resetForm();
            alert('Item updated successfully');
        }
    } else {
        // Create new item
        const newItem = {
            id: Date.now().toString(),
            tamilName,
            englishName,
            price,
            imageUrl: imageUrl || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(englishName)
        };
        menuItems.push(newItem);
        saveMenuItems();
        renderMenuItems();
        resetForm();
        alert('New item added successfully');
    }
}

// Edit menu item
function editItem(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;

    editingItemId = itemId;
    document.getElementById('itemId').value = itemId;
    document.getElementById('tamilName').value = item.tamilName;
    document.getElementById('englishName').value = item.englishName;
    document.getElementById('price').value = item.price;
    document.getElementById('imageUrl').value = item.imageUrl || '';

    document.getElementById('formTitle').textContent = 'Edit Item';
    document.getElementById('submitBtn').textContent = 'Update';
    document.getElementById('cancelBtn').style.display = 'inline-block';

    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Delete menu item
function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    menuItems = menuItems.filter(item => item.id !== itemId);
    saveMenuItems();
    renderMenuItems();
    alert('Item deleted successfully');
}

// Reset form
function resetForm() {
    editingItemId = null;
    document.getElementById('menuForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Item';
    document.getElementById('submitBtn').textContent = 'Add';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Render menu items
function renderMenuItems() {
    const itemsGrid = document.getElementById('itemsGrid');
    if (!itemsGrid) return;

    itemsGrid.innerHTML = '';

    if (menuItems.length === 0) {
        itemsGrid.innerHTML = '<p class="no-data">No items available</p>';
        return;
    }

    menuItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <img src="${item.imageUrl || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(item.englishName)}" 
                 alt="${item.englishName}" 
                 class="item-card-image"
                 onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(item.englishName)}'">
            <div class="item-card-info">
                <h4>${item.tamilName}</h4>
                <p>${item.englishName}</p>
                <div class="item-card-price">₹${item.price}</div>
            </div>
            <div class="item-card-actions">
                <button class="btn-edit" onclick="editItem('${item.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteItem('${item.id}')">Delete</button>
            </div>
        `;
        itemsGrid.appendChild(itemCard);
    });
}

// Make functions globally available
window.editItem = editItem;
window.deleteItem = deleteItem;



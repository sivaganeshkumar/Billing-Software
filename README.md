# GR Bhavan Mess - Restaurant Website

A complete Tamil restaurant website with billing system, menu management, and sales reporting.

## Features

### Customer Features
- **Menu Display**: Browse menu items with images (Idli, Poori, Dosa, Santhagai, Meals, Parotta)
- **Cart System**: Click items to add to cart, adjust quantities
- **Billing**: Automatic total calculation
- **Payment**: QR code generation for payment
- **Bill Printing**: Print-friendly receipt generation
- **Clear Cart**: Easy cart reset

### Admin Features
- **Menu Management (CRUD)**:
  - Create: Add new menu items
  - Read: View all menu items
  - Update: Edit existing items
  - Delete: Remove items
- **Sales Reporting**: Monthly sales reports with filtering

## File Structure

```
gr-bhavan-mess/
├── index.html              # Main page with menu and cart
├── manage-menu.html        # Menu management page (CRUD)
├── sales-report.html       # Monthly sales report page
├── styles/
│   └── main.css           # All styling
├── scripts/
│   ├── main.js            # Main cart and billing logic
│   ├── menu-manager.js    # CRUD operations for menu
│   └── sales-report.js    # Sales reporting logic
├── images/                # Menu item images (optional)
└── README.md              # This file
```

## Getting Started

1. **Open the website**: Simply open `index.html` in your web browser
   - Double-click the file, or
   - Right-click and select "Open with" your preferred browser

2. **Local Development Server** (recommended):
   - Python: `python -m http.server 8000`
   - Node.js: `npx http-server`
   - VS Code: Use the "Live Server" extension

## Usage

### For Customers

1. **Browse Menu**: View all available items on the main page
2. **Add to Cart**: Click on any menu item to add it to cart
3. **Adjust Quantity**: Use +/- buttons to change quantities
4. **Remove Items**: Click "நீக்கு" (Remove) to delete items from cart
5. **Pay Now**: Click "பணம் செலுத்த" to see QR code for payment
6. **Print Bill**: Click "பில் அச்சிடு" to print the receipt
7. **Clear Cart**: Click "கார்ட்டை அழிக்க" to empty the cart

### For Admin

#### Menu Management
1. Navigate to "மெனு நிர்வாகம்" (Menu Management)
2. **Add Item**: Fill the form and click "சேர்க்க" (Add)
3. **Edit Item**: Click "திருத்து" (Edit) on any item
4. **Delete Item**: Click "நீக்கு" (Delete) on any item

#### Sales Report
1. Navigate to "விற்பனை அறிக்கை" (Sales Report)
2. Select month and year
3. Click "அறிக்கையை காட்டு" (Show Report)
4. View total sales and transactions
5. Click "அச்சிடு" (Print) to print the report

## Data Storage

All data is stored in browser's localStorage:
- **Menu Items**: Stored as `menuItems`
- **Cart**: Stored as `cart`
- **Sales History**: Stored as `salesHistory`

## Customization

### Changing Restaurant Name
- Update the logo text in all HTML files (search for "GR Bhavan Mess")

### Adding Menu Items
- Use the Menu Management page to add items
- Or edit `scripts/main.js` and `scripts/menu-manager.js` to modify default items

### Changing Payment QR Code
- Edit the `paymentData` variable in `scripts/main.js` (line with UPI details)
- Format: `UPI:YOUR_UPI_ID@paytm|Amount:AMOUNT|Ref:REFERENCE`

### Images
- Place images in the `images/` folder
- Or use image URLs in the menu management form
- Default items use Unsplash placeholder images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, responsive design)
- Vanilla JavaScript (ES6+)
- QRCode.js (CDN) for QR code generation
- localStorage for data persistence
- Noto Sans Tamil font for Tamil language support

## Language Support

- All UI text in Tamil
- Menu items with Tamil names and English transliteration
- Proper Tamil Unicode rendering

## Notes

- Data persists in browser localStorage (cleared if browser data is cleared)
- QR code contains payment information (customize as needed)
- Print functionality uses browser's print dialog
- Responsive design works on mobile, tablet, and desktop
- Default menu items are initialized on first load

## License

This project is open source and available for personal and commercial use.


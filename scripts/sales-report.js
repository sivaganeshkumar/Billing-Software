// Sales Report Management
let salesHistory = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSalesHistory();
    populateYearSelect();
    setCurrentMonth();
    setupEventListeners();
    filterSales();
});

// Load sales history from localStorage
function loadSalesHistory() {
    const stored = localStorage.getItem('salesHistory');
    if (stored) {
        salesHistory = JSON.parse(stored);
    }
}

// Populate year select dropdown
function populateYearSelect() {
    const yearSelect = document.getElementById('yearSelect');
    if (!yearSelect) return;

    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';

    // Add years from current year to 5 years back
    for (let i = 0; i <= 5; i++) {
        const year = currentYear - i;
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (i === 0) option.selected = true;
        yearSelect.appendChild(option);
    }
}

// Set current month
function setCurrentMonth() {
    const monthSelect = document.getElementById('monthSelect');
    if (!monthSelect) return;

    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    monthSelect.value = currentMonth;
}

// Setup event listeners
function setupEventListeners() {
    const filterBtn = document.getElementById('filterBtn');
    const printReportBtn = document.getElementById('printReportBtn');
    const monthlyRadio = document.getElementById('monthlyRadio');
    const dailyRadio = document.getElementById('dailyRadio');
    const rangeRadio = document.getElementById('rangeRadio');
    const dateSelect = document.getElementById('dateSelect');
    const dateSelectGroup = document.getElementById('dateSelectGroup');
    const exportFormat = document.getElementById('exportFormat');
    const exportBtn = document.getElementById('exportBtn');
    const activeReportLabel = document.getElementById('activeReportLabel');

    if (filterBtn) {
        filterBtn.addEventListener('click', filterSales);
    }

    if (printReportBtn) {
        printReportBtn.addEventListener('click', printReport);
    }

    // Unified export button (CSV or PDF)
    if (exportBtn && exportFormat) {
        exportBtn.addEventListener('click', async () => {
            const fmt = exportFormat.value;
            if (fmt === 'csv') {
                exportCsv();
            } else if (fmt === 'pdf') {
                await exportPdf();
            }
        });
    }

    // Show/hide controls based on report type
    function updateReportTypeUI() {
        if (dailyRadio && dailyRadio.checked) {
            // show date, hide month/year selects
            if (dateSelectGroup) dateSelectGroup.style.display = 'block';
            const monthSelect = document.getElementById('monthSelect');
            const yearSelect = document.getElementById('yearSelect');
            if (monthSelect) monthSelect.parentElement.style.display = 'none';
            if (yearSelect) yearSelect.parentElement.style.display = 'none';
            // auto-fill today's date if not set
            if (dateSelect && !dateSelect.value) {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                dateSelect.value = `${yyyy}-${mm}-${dd}`;
            }
        } else {
            if (dateSelectGroup) dateSelectGroup.style.display = 'none';
            const monthSelect = document.getElementById('monthSelect');
            const yearSelect = document.getElementById('yearSelect');
            if (monthSelect) monthSelect.parentElement.style.display = '';
            if (yearSelect) yearSelect.parentElement.style.display = '';
        }
        // automatically update report whenever report type changes
        try { filterSales(); } catch (e) { /* ignore */ }
    }

    if (monthlyRadio) monthlyRadio.addEventListener('change', updateReportTypeUI);
    if (dailyRadio) dailyRadio.addEventListener('change', updateReportTypeUI);
    // initialize UI state
    updateReportTypeUI();
}

// Filter sales by month and year
function filterSales() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const dateSelect = document.getElementById('dateSelect');
    const dailyRadio = document.getElementById('dailyRadio');
    const rangeRadio = document.getElementById('rangeRadio');
    const startDateSelect = document.getElementById('startDateSelect');
    const endDateSelect = document.getElementById('endDateSelect');
    const tableBody = document.getElementById('salesTableBody');
    const totalSales = document.getElementById('totalSales');
    const totalTransactions = document.getElementById('totalTransactions');
    const activeReportLabel = document.getElementById('activeReportLabel');

    if (!tableBody) return;

    let filteredSales = [];

    if (dailyRadio && dailyRadio.checked && dateSelect && dateSelect.value) {
        // Daily report selected
        const selectedDate = new Date(dateSelect.value);
        const selY = selectedDate.getFullYear();
        const selM = selectedDate.getMonth();
        const selD = selectedDate.getDate();

        filteredSales = salesHistory.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getFullYear() === selY && saleDate.getMonth() === selM && saleDate.getDate() === selD;
        });
        if (activeReportLabel) activeReportLabel.textContent = `Showing Daily report for ${dateSelect.value}`;
    } else if (monthSelect && yearSelect) {
        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;

        // Filter sales for selected month and year
        filteredSales = salesHistory.filter(sale => {
            const saleDate = new Date(sale.date);
            const saleMonth = String(saleDate.getMonth() + 1).padStart(2, '0');
            const saleYear = saleDate.getFullYear().toString();
            return saleMonth === selectedMonth && saleYear === selectedYear;
        });
    }

    // Sort by date (newest first)
    filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render table
    renderSalesTable(filteredSales, tableBody);

    // Update summary
    const total = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    if (totalSales) {
        totalSales.textContent = `₹${total.toFixed(2)}`;
    }
    if (totalTransactions) {
        totalTransactions.textContent = filteredSales.length;
    }
}

// Render sales table
function renderSalesTable(sales, tableBody) {
    if (!tableBody) return;

    if (sales.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="no-data">No data available</td></tr>';
        return;
    }

    tableBody.innerHTML = '';

    sales.forEach(sale => {
        const row = document.createElement('tr');
        const saleDate = new Date(sale.date);
        const formattedDate = saleDate.toLocaleDateString('en-IN');
        const time = sale.time || saleDate.toLocaleTimeString('en-IN');
        const itemsCount = sale.items ? sale.items.length : 0;

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${time}</td>
            <td>${itemsCount}</td>
            <td>₹${sale.total.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Print report
function printReport() {
    window.print();
}

// Add print styles for report
const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        body * {
            visibility: hidden;
        }
        .main-content,
        .main-content * {
            visibility: visible;
        }
        .main-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
        .filter-container,
        .summary-container,
        .table-container {
            page-break-inside: avoid;
        }
        .btn {
            display: none;
        }
    }
`;
document.head.appendChild(printStyle);

// Export CSV from currently rendered table
function exportCsv() {
    const tableBody = document.getElementById('salesTableBody');
    if (!tableBody) return;
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const csv = ['Date,Time,Items,Total'];
    rows.forEach(r => {
        const cols = Array.from(r.querySelectorAll('td')).map(c => '"' + c.textContent.trim().replace(/"/g, '""') + '"');
        if (cols.length === 4) csv.push(cols.join(','));
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const fname = `sales-report-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.csv`;
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export PDF using html2canvas + jsPDF, include the header/logo
async function exportPdf() {
    try {
        // Capture the report area (.main-content)
        const main = document.querySelector('.main-content');
        if (!main) return;

        // Expand main into a clone to ensure backdrop overlays don't interfere
        const clone = main.cloneNode(true);
        clone.style.width = getComputedStyle(main).width;
        clone.style.background = '#fff';
        clone.style.padding = '20px';
        // Append clone to body offscreen
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        document.body.appendChild(clone);

        // Ensure header/logo is included: clone header separately and prepend
        const header = document.querySelector('.header');
        if (header) {
            const headerClone = header.cloneNode(true);
            headerClone.style.marginBottom = '10px';
            clone.insertAdjacentElement('beforebegin', headerClone);
        }

        // Use html2canvas to render the clone area (including headerClone if present)
        const nodeToCapture = document.querySelector('.header') ? document.body : clone; // we'll capture body so that headerClone is included
        const canvas = await html2canvas(nodeToCapture, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });

        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = { width: canvas.width, height: canvas.height };
        const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
        const imgWidth = imgProps.width * ratio;
        const imgHeight = imgProps.height * ratio;
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        const now = new Date();
        pdf.save(`sales-report-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.pdf`);

        // cleanup
        if (header && document.body.contains(header)) {
            // remove headerClone if present (we inserted it before clone)
            // find first header before clone
            const insertedHeader = document.querySelector('.header');
            if (insertedHeader && insertedHeader !== header) insertedHeader.remove();
        }
        if (document.body.contains(clone)) document.body.removeChild(clone);
    } catch (err) {
        console.error('PDF export failed', err);
        alert('PDF export failed. Try exporting CSV instead.');
    }
}
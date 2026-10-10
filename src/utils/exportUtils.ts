import { CustomerItem, FilterState, MonthlyTrend, Order, PageId, ProductItem, RegionalMetric } from '../types';

interface ExportContext {
  pageId: PageId;
  filters: FilterState;
  orders: Order[];
  products: ProductItem[];
  customers: CustomerItem[];
  regions: RegionalMetric[];
  monthlyTrend: MonthlyTrend[];
  userName: string;
}

export function exportCurrentViewToCSV(context: ExportContext): string {
  const { pageId, filters, orders, products, customers, regions, monthlyTrend } = context;
  const timestamp = new Date().toISOString().split('T')[0];
  let filename = `enterprise-report-${pageId}-${timestamp}.csv`;
  let csvContent = '';

  switch (pageId) {
    case 'order-management':
    case 'executive-dashboard': {
      filename = `orders-export-${timestamp}.csv`;
      const filtered = orders.filter((o) => {
        if (filters.status !== 'All' && o.status !== filters.status) return false;
        if (filters.region !== 'All Regions' && o.region !== filters.region) return false;
        return true;
      });
      const headers = ['Order ID', 'Customer Name', 'Customer ID', 'Product', 'Product ID', 'Amount (INR)', 'Status', 'Region', 'Date', 'Payment Method'];
      const rows = filtered.map((o) => [
        `"${o.id}"`,
        `"${o.customer}"`,
        `"${o.customerId}"`,
        `"${o.product}"`,
        `"${o.productId}"`,
        o.amount,
        `"${o.status}"`,
        `"${o.region}"`,
        `"${o.date}"`,
        `"${o.paymentMethod}"`
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      break;
    }

    case 'sales-report': {
      filename = `sales-report-monthly-${timestamp}.csv`;
      const headers = ['Month', 'Revenue (Cr)', 'Orders Shipped', 'Last Year Revenue (Cr)', 'YoY Growth (%)'];
      const rows = monthlyTrend.map((m) => {
        const yoy = (((m.revenueCr - m.lastYearRevenueCr) / m.lastYearRevenueCr) * 100).toFixed(1);
        return [`"${m.month}"`, m.revenueCr, m.orders, m.lastYearRevenueCr, `${yoy}%`];
      });
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      break;
    }

    case 'product-performance': {
      filename = `products-catalog-${timestamp}.csv`;
      const filtered = products.filter((p) => {
        if (filters.category !== 'All Categories' && p.category !== filters.category) return false;
        return true;
      });
      const headers = ['Product ID', 'Product Name', 'Category', 'Revenue (Cr)', 'Units Sold', 'Stock Inventory', 'Rating', 'Growth (%)'];
      const rows = filtered.map((p) => [
        `"${p.id}"`,
        `"${p.name}"`,
        `"${p.category}"`,
        p.revenue,
        p.unitsSold,
        p.stock,
        p.rating,
        `${p.growth}%`
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      break;
    }

    case 'regional-analysis': {
      filename = `regional-performance-${timestamp}.csv`;
      const headers = ['Territory Region', 'Revenue (Cr)', 'Market Share (%)', 'Order Volume', 'YoY Growth (%)', 'Top Product', 'Active Accounts'];
      const rows = regions.map((r) => [
        `"${r.region}"`,
        r.revenueCr,
        `${r.percentage}%`,
        r.orders,
        `${r.growth}%`,
        `"${r.topProduct}"`,
        r.activeCustomers
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      break;
    }

    case 'customer-directory': {
      filename = `customer-directory-${timestamp}.csv`;
      const filtered = customers.filter((c) => {
        if (filters.region !== 'All Regions' && c.region !== filters.region) return false;
        if (filters.status !== 'All' && c.status !== filters.status) return false;
        return true;
      });
      const headers = ['Customer ID', 'Full Name', 'Email', 'Location', 'Region', 'Segment Type', 'Orders Count', 'Total Spent (INR)', 'Account Status'];
      const rows = filtered.map((c) => [
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.location}"`,
        `"${c.region}"`,
        `"${c.type}"`,
        c.ordersCount,
        c.totalSpent,
        `"${c.status}"`
      ]);
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      break;
    }

    default: {
      filename = `report-summary-${timestamp}.csv`;
      const headers = ['Metric', 'Value', 'Reference Filter', 'Generated At'];
      const rows = [
        ['Total Revenue', '₹ 12.4 Cr', `Region: ${filters.region}`, new Date().toLocaleString()],
        ['Total Orders', '8,420', `Status: ${filters.status}`, new Date().toLocaleString()],
        ['Active Customers', '2,120', `Category: ${filters.category}`, new Date().toLocaleString()],
        ['Average Order Value', '₹ 14,720', `Date: ${filters.dateRange}`, new Date().toLocaleString()]
      ];
      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      break;
    }
  }

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

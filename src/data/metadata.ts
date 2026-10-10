import { PageMetadata } from '../types';

export const STANDARD_DATE_RANGES = [
  'FY 2025-2026 (Oct 2025 - Sep 2026)',
  'Full Year 2026 (Jan - Dec 2026)',
  'Q1 2026 (Jan - Mar 2026)',
  'Q2 2026 (Apr - Jun 2026)',
  'Q3 2026 (Jul - Sep 2026)',
  'Q4 2026 (Oct - Dec 2026)',
  'Aug - Sep 2026 (Festival Peak)',
  'Full Year 2025 (Jan - Dec 2025)'
];

export const APP_METADATA_CATALOG: PageMetadata[] = [
  {
    id: 'executive-dashboard',
    title: 'Executive Dashboard',
    description: 'High-level executive overview of overall business performance, revenue trends, regional market shares, top selling products, and live order activities.',
    route: '/dashboard',
    keywords: [
      'overview', 'executive', 'summary', 'home', 'kpi', 'revenue trend',
      'macro', 'overall', 'performance', 'crore', 'revenue', 'market share', 'total sales'
    ],
    widgets: [
      {
        id: 'kpi_summary_grid',
        title: 'Executive KPI Summary Cards',
        type: 'kpi_cards',
        description: 'Shows Total Revenue (₹12.4 Cr), Total Orders (8,420), Total Customers (2,350), and Avg Order Value (₹14,720) with period growth percentages.'
      },
      {
        id: 'revenue_trend_chart',
        title: 'Revenue Trend Line Chart',
        type: 'line_chart',
        description: 'Interactive monthly revenue progression from Jan 2025 to Dec 2025 showing growth curve.'
      },
      {
        id: 'sales_by_region_donut',
        title: 'Sales by Region Donut Chart',
        type: 'donut_chart',
        description: 'Geographical share breakdown across Karnataka (32%), Delhi (24%), Maharashtra (18%), Tamil Nadu (12%), and Others (14%).'
      },
      {
        id: 'top_products_bar',
        title: 'Top Products by Revenue Bar Chart',
        type: 'bar_chart',
        description: 'Revenue comparison for Laptop, Smartphone, Tablet, Headphones, and Monitor.'
      },
      {
        id: 'recent_orders_preview',
        title: 'Recent Orders Activity Table',
        type: 'data_table',
        description: 'Latest transaction stream with Order ID, customer name, purchased product, amount in INR, and fulfillment status.'
      }
    ],
    supportedFilters: [
      {
        key: 'dateRange',
        label: 'Date Range',
        options: STANDARD_DATE_RANGES
      }
    ]
  },
  {
    id: 'sales-report',
    title: 'Sales Report',
    description: 'Comprehensive financial reporting breakdown with category-level sales, monthly comparison of gross revenue versus order volumes, and return rate audits.',
    route: '/sales',
    keywords: [
      'sales', 'revenue', 'returns', 'return rate', 'monthly sales', 'financial',
      'units sold', 'category sales', 'gross merchandise value', 'gmv', 'invoicing'
    ],
    widgets: [
      {
        id: 'sales_kpi_metrics',
        title: 'Sales Metrics Header',
        type: 'kpi_cards',
        description: 'Total Sales (₹12.4 Cr), Total Orders (8,420), Units Sold (24,350), and Return Rate (2.4%).'
      },
      {
        id: 'monthly_sales_dual_chart',
        title: 'Monthly Sales Revenue & Volume Chart',
        type: 'line_chart',
        description: 'Dual-axis visualizer tracking monthly revenue in Crores alongside monthly order volumes.'
      },
      {
        id: 'sales_by_category_table',
        title: 'Sales by Product Category Table',
        type: 'data_table',
        description: 'Granular tabular view containing Electronics, Accessories, Home & Office, and Other categories.'
      }
    ],
    supportedFilters: [
      {
        key: 'region',
        label: 'Region',
        options: ['All Regions', 'Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Others']
      },
      {
        key: 'category',
        label: 'Product Category',
        options: ['All Categories', 'Electronics', 'Accessories', 'Home & Office', 'Other']
      },
      {
        key: 'status',
        label: 'Status',
        options: ['All', 'Delivered', 'Processing', 'Cancelled', 'Returned']
      },
      {
        key: 'dateRange',
        label: 'Date Range',
        options: STANDARD_DATE_RANGES
      }
    ]
  },
  {
    id: 'product-performance',
    title: 'Product Performance',
    description: 'Catalog analytics, SKU revenue contribution, inventory stock levels, customer satisfaction ratings, and high-velocity item rankings.',
    route: '/products',
    keywords: [
      'product', 'products', 'sku', 'inventory', 'stock', 'rating', 'active products',
      'catalog', 'electronics', 'laptop', 'smartphone', 'headphones', 'tablet', 'monitor'
    ],
    widgets: [
      {
        id: 'product_kpi_cards',
        title: 'Catalog Health Metrics',
        type: 'kpi_cards',
        description: 'Total Products (120), Active Products (98), Total Revenue (₹12.4 Cr), and Average Customer Rating (4.2/5).'
      },
      {
        id: 'product_performance_chart',
        title: 'Product Revenue vs Units Sold Visualizer',
        type: 'bar_chart',
        description: 'Comparative dual-bar chart showing product profitability versus volume shipped.'
      },
      {
        id: 'top_performing_products_table',
        title: 'Product Catalog Rankings Table',
        type: 'data_table',
        description: 'Table listing Product name, Category, Total Revenue, Units Sold, Stock inventory, and Rating.'
      }
    ],
    supportedFilters: [
      {
        key: 'category',
        label: 'Category',
        options: ['All Categories', 'Electronics', 'Accessories', 'Home & Office', 'Other']
      },
      {
        key: 'region',
        label: 'Region',
        options: ['All Regions', 'Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Others']
      },
      {
        key: 'dateRange',
        label: 'Date Range',
        options: STANDARD_DATE_RANGES
      }
    ]
  },
  {
    id: 'regional-analysis',
    title: 'Regional Analysis',
    description: 'Territorial and geographical performance across India states with interactive choropleth heatmap, regional market contribution, and growth velocities.',
    route: '/regional',
    keywords: [
      'region', 'regional', 'territory', 'geography', 'india', 'karnataka', 'delhi',
      'maharashtra', 'tamil nadu', 'mumbai', 'bangalore', 'south', 'north', 'west', 'map', 'heat map'
    ],
    widgets: [
      {
        id: 'regional_kpi_cards',
        title: 'Geographic Highlights',
        type: 'kpi_cards',
        description: 'Total Regions (8), Top Region (Karnataka ₹4.0 Cr), Total Revenue (₹12.4 Cr), and Aggregate Growth (+12.5%).'
      },
      {
        id: 'india_geo_map',
        title: 'India Regional Heatmap',
        type: 'geo_map',
        description: 'Interactive choropleth map highlighting state-wise revenue intensity from dark navy to bright blue.'
      },
      {
        id: 'regional_performance_table',
        title: 'Regional Breakdown Table',
        type: 'data_table',
        description: 'Table detailing Region, Revenue (Cr), Market Share %, Active Customers, and Year-over-Year Growth.'
      }
    ],
    supportedFilters: [
      {
        key: 'region',
        label: 'Region',
        options: ['All Regions', 'Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Others']
      },
      {
        key: 'metric',
        label: 'Metric',
        options: ['Revenue', 'Orders', 'Growth', 'Customers']
      },
      {
        key: 'dateRange',
        label: 'Date Range',
        options: STANDARD_DATE_RANGES
      }
    ]
  },
  {
    id: 'customer-directory',
    title: 'Customer Directory',
    description: 'Master record of all registered enterprise and retail clients, lifetime expenditure, location distribution, segment types, and churn monitoring.',
    route: '/customers',
    keywords: [
      'customer', 'customers', 'client', 'directory', 'users', 'churn', 'active customers',
      'vip', 'enterprise', 'retail', 'clv', 'lifetime value', 'rohan', 'priya', 'karan'
    ],
    widgets: [
      {
        id: 'customer_kpi_cards',
        title: 'Customer Cohort Metrics',
        type: 'kpi_cards',
        description: 'Total Customers (2,350), Active Customers (2,120), New Customers (230), and Churn Rate (3.2%).'
      },
      {
        id: 'customer_roster_table',
        title: 'Customer Directory Roster',
        type: 'data_table',
        description: 'Searchable grid featuring Customer ID, Full Name, Location, Segment, Total Spent, and Account Status.'
      }
    ],
    supportedFilters: [
      {
        key: 'searchQuery',
        label: 'Search',
        options: []
      },
      {
        key: 'region',
        label: 'Region',
        options: ['All Regions', 'Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Others']
      },
      {
        key: 'category',
        label: 'Customer Type',
        options: ['All Types', 'Enterprise', 'Retail', 'VIP']
      },
      {
        key: 'status',
        label: 'Status',
        options: ['All', 'Active', 'Inactive', 'Churned']
      }
    ]
  },
  {
    id: 'order-management',
    title: 'Order Management',
    description: 'Live order lifecycle operations, dispatch tracking, pending order queue, cancellation root-cause tracking, and fulfillment verification.',
    route: '/orders',
    keywords: [
      'order', 'orders', 'management', 'transactions', 'dispatch', 'cancelled', 'cancelled orders',
      'processing', 'delivered', 'returned', 'order id', 'fulfillment', 'shipment'
    ],
    widgets: [
      {
        id: 'order_status_badges',
        title: 'Fulfillment Status Counters',
        type: 'kpi_cards',
        description: 'Total Orders (8,420), Delivered (7,820), Processing (420), and Cancelled (180).'
      },
      {
        id: 'order_management_grid',
        title: 'Order Transaction Operations Table',
        type: 'data_table',
        description: 'Operational datagrid with Order ID (ORD-1001..), Customer, Item, Amount in INR, Region, and Status tag.'
      }
    ],
    supportedFilters: [
      {
        key: 'status',
        label: 'Status',
        options: ['All', 'Delivered', 'Processing', 'Cancelled', 'Returned']
      },
      {
        key: 'region',
        label: 'Region',
        options: ['All Regions', 'Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Others']
      },
      {
        key: 'dateRange',
        label: 'Date Range',
        options: STANDARD_DATE_RANGES
      }
    ]
  },
  {
    id: 'benchmark-evaluation',
    title: 'Benchmark Evaluation',
    description: 'Automated 125-test evaluation benchmark measuring intent-to-destination routing accuracy, UI-slot filling precision, multi-step orchestration, and guardrail reliability.',
    route: '/benchmark',
    keywords: [
      'benchmark', 'evaluation', 'test', 'tests', '125 tests', 'accuracy', 'kpi', 'rubric',
      'slot filling', 'ground truth', 'precision', 'recall', 'guardrails', 'metrics', 'score'
    ],
    widgets: [
      {
        id: 'benchmark_kpi_summary',
        title: 'Benchmark Metrics Overview',
        type: 'kpi_cards',
        description: 'Displays 98.4% Intent Accuracy, 96.8% UI State Correctness, 95.2% Multi-step Success, 99.2% Safety Score.'
      },
      {
        id: 'benchmark_interactive_suite',
        title: 'Automated 125 Benchmark Suite Runner',
        type: 'bench_suite',
        description: 'Interactive execution console running real utterances against the context-aware agent engine with pass/fail telemetry.'
      }
    ],
    supportedFilters: [
      {
        key: 'category',
        label: 'Benchmark Category',
        options: ['All Categories', 'Navigation', 'Filter & Slot Filling', 'Analytical Reasoning', 'Multi-Step Orchestration', 'Guardrail & Rejection']
      },
      {
        key: 'status',
        label: 'Test Status',
        options: ['All', 'Passed', 'Failed', 'Pending']
      }
    ]
  },
  {
    id: 'agent-blackboard',
    title: 'Agent Blackboard & Architecture',
    description: 'Live interactive view of the 3-Tier Context-Aware Agent Architecture: Tier 1 HostAgent Orchestrator, Tier 2 Blackboard Memory Bus & Trajectory Logs, and Tier 3 AppAgent execution.',
    route: '/architecture',
    keywords: [
      'architecture', 'blackboard', 'orchestrator', 'tier 1', 'tier 2', 'tier 3',
      'memory bus', 'trajectory', 'fsm', 'state machine', 'synthetic data', 'hostagent', 'appagent', 'blueprint'
    ],
    widgets: [
      {
        id: 'three_tier_blueprint_view',
        title: 'Three-Tier Architecture Diagram',
        type: 'architecture_diagram',
        description: 'Visual breakdown of HostAgent, Blackboard Shared Substrate, and Execution Layer.'
      },
      {
        id: 'live_trajectory_bus',
        title: 'Real-Time Trajectory Stream & Memory Inspector',
        type: 'data_table',
        description: 'Live audit log of all agent actions, RAG retrieval queries, episodic memory updates, and state mutations.'
      }
    ],
    supportedFilters: [
      {
        key: 'category',
        label: 'Tier Filter',
        options: ['All Tiers', 'Tier 1: Intent & Orchestrator', 'Tier 2: Memory & Knowledge Bus', 'Tier 3: Execution AppAgent']
      }
    ]
  },
  {
    id: 'login',
    title: 'Personas & Login Portal',
    description: 'Multi-persona authentication console supporting #01 Onboarding, #02 Platform Admin, #03 Enterprise Admin, and #04 User Persona with 1-click preset logins, SSO, OTP, and password authentication.',
    route: '/login',
    keywords: [
      'login', 'auth', 'sign in', 'authenticate', 'persona', 'onboarding',
      'platform admin', 'enterprise admin', 'user persona', 'developer', 'sso', 'otp'
    ],
    widgets: [
      {
        id: 'persona_journey_visualizer',
        title: 'Persona User Flow Journey',
        type: 'architecture_diagram',
        description: 'Interactive step-by-step lifecycle from first sign-in to metered inference token usage.'
      },
      {
        id: 'secure_auth_console',
        title: 'Secure Authentication Console',
        type: 'data_table',
        description: 'Credential input, 1-click persona switchers, and single sign-on federation.'
      }
    ],
    supportedFilters: []
  }
];

// Available Tools for the Agent
export const AGENT_TOOLS_DEFINITIONS = [
  {
    name: 'navigate_to_page',
    description: 'Navigates the user to one of the 8 application views in the enterprise system.',
    parameters: {
      pageId: {
        type: 'string',
        enum: [
          'executive-dashboard',
          'sales-report',
          'product-performance',
          'regional-analysis',
          'customer-directory',
          'order-management',
          'benchmark-evaluation',
          'agent-blackboard',
          'login'
        ],
        description: 'The target page ID to navigate to'
      }
    }
  },
  {
    name: 'apply_filter',
    description: 'Sets specific UI filters on the active or destination page such as region, category, status, dateRange, or search query.',
    parameters: {
      pageId: { type: 'string', description: 'The page to apply filters on' },
      filterKey: { type: 'string', enum: ['region', 'category', 'status', 'dateRange', 'metric', 'searchQuery'] },
      value: { type: 'string', description: 'Value to assign to the filter' }
    }
  },
  {
    name: 'reset_filters',
    description: 'Resets all filters on a page to default state.',
    parameters: {
      pageId: { type: 'string' }
    }
  },
  {
    name: 'compute_analytics',
    description: 'Computes analytical comparisons, period-over-period trends, category rankings, or root-cause explanations on the enterprise dataset.',
    parameters: {
      metric: { type: 'string', description: 'e.g. revenue, orders, return_rate, churn, regional_comparison' },
      dimension: { type: 'string', description: 'e.g. region, month, product, status' },
      period: { type: 'string', description: 'e.g. 2025, Q1, last_month' }
    }
  },
  {
    name: 'generate_synthetic_tenant_data',
    description: 'Synthesizes sample business data (orders, revenue, customer cohort) with custom volume, variance, or date windows.',
    parameters: {
      recordsCount: { type: 'number', description: 'Number of order transactions to generate' },
      growthFactor: { type: 'number', description: 'Multiplier for revenue' }
    }
  }
];

export type PageId =
  | 'executive-dashboard'
  | 'sales-report'
  | 'product-performance'
  | 'regional-analysis'
  | 'customer-directory'
  | 'order-management'
  | 'benchmark-evaluation'
  | 'agent-blackboard'
  | 'login';

export type OrderStatus = 'Delivered' | 'Processing' | 'Cancelled' | 'Returned';
export type CustomerType = 'Enterprise' | 'Retail' | 'VIP';
export type CustomerStatus = 'Active' | 'Inactive' | 'Churned';

export interface FilterState {
  region: string;
  category: string;
  status: string;
  dateRange: string;
  metric?: string;
  searchQuery?: string;
}

export interface Order {
  id: string;
  customer: string;
  customerId: string;
  product: string;
  productId: string;
  amount: number;
  status: OrderStatus;
  region: string;
  date: string;
  paymentMethod: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  revenue: number; // in Cr or INR
  unitsSold: number;
  stock: number;
  rating: number;
  growth: number;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  location: string;
  region: string;
  ordersCount: number;
  totalSpent: number;
  status: CustomerStatus;
  type: CustomerType;
  joinedDate: string;
  lastOrderDate: string;
}

export interface RegionalMetric {
  region: string;
  revenueCr: number;
  percentage: number;
  orders: number;
  growth: number;
  topProduct: string;
  activeCustomers: number;
}

export interface MonthlyTrend {
  month: string;
  revenueCr: number;
  orders: number;
  lastYearRevenueCr: number;
}

export interface PageMetadata {
  id: PageId;
  title: string;
  description: string;
  route: string;
  keywords: string[];
  widgets: {
    id: string;
    title: string;
    type: 'kpi_cards' | 'line_chart' | 'donut_chart' | 'bar_chart' | 'data_table' | 'geo_map' | 'bench_suite' | 'architecture_diagram';
    description: string;
  }[];
  supportedFilters: {
    key: keyof FilterState;
    label: string;
    options: string[];
  }[];
}

export interface AgentAction {
  id: string;
  type: 'NAVIGATE' | 'APPLY_FILTER' | 'RESET_FILTERS' | 'ANALYZE_DATA' | 'REGENERATE_DATA' | 'TRIGGER_BENCHMARK' | 'EXPORT_DATA';
  label: string;
  payload: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  resultSummary?: string;
  timestamp: string;
}

export interface SaleTransaction {
  id: string;
  date: string;
  region: string;
  category: string;
  product: string;
  units: number;
  revenue: number;
  customerId: string;
}

export interface StoryCard {
  id: string;
  title: string;
  category: 'Anomaly' | 'Growth' | 'Risk' | 'Opportunity';
  period: string;
  metric: string;
  changeValue: string;
  isPositive: boolean;
  description: string;
  drivers: string[];
  suggestedPrompt: string;
  targetPage: PageId;
  targetFilters?: Partial<FilterState>;
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  actions?: AgentAction[];
  suggestedFollowUps?: string[];
  reasoningSteps?: string[];
  dataInsights?: {
    metric: string;
    value: string;
    change?: string;
    context?: string;
  }[];
  refusal?: {
    code: string;
    message: string;
    suggestions: string[];
  };
  clarification?: {
    question: string;
    options: string[];
  };
  pendingPlan?: {
    actions: AgentAction[];
    summary: string;
    targetPage?: PageId;
    targetFilters?: Partial<FilterState>;
  };
}

export interface BlackboardLog {
  id: string;
  timestamp: string;
  tier: 'Tier 1: Intent & Orchestrator' | 'Tier 2: Memory & Knowledge Bus' | 'Tier 3: Execution AppAgent';
  event: string;
  details: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface BenchmarkTestCase {
  id: string;
  category: 'Navigation' | 'Filter & Slot Filling' | 'Analytical Reasoning' | 'Multi-Step Orchestration' | 'Guardrail & Rejection';
  prompt: string;
  expectedPage: PageId;
  expectedFilters?: Partial<FilterState>;
  expectedActionTypes: string[];
  reasoningTopic: string;
  status?: 'passed' | 'failed' | 'pending';
  actualOutput?: string;
  latencyMs?: number;
}

export type UserRole =
  | 'Admin'
  | 'Platform Admin'
  | 'Enterprise Admin'
  | 'Regional Sales Manager'
  | 'Operations Analyst'
  | 'Executive Viewer'
  | 'Customer';

export type PersonaType =
  | 'onboarding'
  | 'platform-admin'
  | 'sales-manager'
  | 'ops-analyst'
  | 'executive-viewer'
  | 'enterprise-admin'
  | 'user-persona';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'agent' | 'system' | 'data' | 'crud' | 'approval';
  read: boolean;
  linkPage?: PageId;
}

export interface ChangeRequest {
  id: string;
  requesterName: string;
  requesterRole: string;
  requesterEmail: string;
  type: 'UPDATE' | 'DELETE' | 'CREATE';
  entity: 'order' | 'product' | 'customer';
  entityId: string;
  description: string;
  payload: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}


import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  AgentAction,
  AgentMessage,
  AppNotification,
  BlackboardLog,
  CustomerItem,
  FilterState,
  MonthlyTrend,
  Order,
  OrderStatus,
  PageId,
  ProductItem,
  RegionalMetric,
  UserRole,
  ChangeRequest
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_MONTHLY_TREND,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REGIONS,
  generateSyntheticTenantDataset
} from '../data/syntheticData';
import { agentEngine } from '../services/agentEngine';

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  
  // Data State
  orders: Order[];
  products: ProductItem[];
  customers: CustomerItem[];
  regions: RegionalMetric[];
  monthlyTrend: MonthlyTrend[];
  regenerateSyntheticData: (multiplier?: number) => void;

  // RBAC Change Request Queue
  changeRequests: ChangeRequest[];
  submitChangeRequest: (req: Omit<ChangeRequest, 'id' | 'timestamp' | 'status'>) => void;
  approveChangeRequest: (reqId: string) => void;
  rejectChangeRequest: (reqId: string) => void;

  // CRUD Operations
  addOrder: (newOrder: Omit<Order, 'id'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  addProduct: (newProd: Omit<ProductItem, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (productId: string) => void;

  addCustomer: (newCust: Omit<CustomerItem, 'id'>) => void;
  updateCustomer: (customerId: string, updates: Partial<CustomerItem>) => void;
  deleteCustomer: (customerId: string) => void;
  
  // Agent Chat State
  agentMessages: AgentMessage[];
  isAgentThinking: boolean;
  activeExecutionPlan: AgentAction[] | null;
  submitUserPrompt: (prompt: string) => Promise<void>;
  clearChat: () => void;
  
  // Blackboard Logs State
  blackboardLogs: BlackboardLog[];
  addBlackboardLog: (log: Omit<BlackboardLog, 'id' | 'timestamp'>) => void;

  // Notifications State
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  
  // UI & User State
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  logout: () => void;
  hasActiveFilters: boolean;
  isApprovalsModalOpen: boolean;
  setIsApprovalsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isAgentPanelOpen: boolean;
  setIsAgentPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DEFAULT_FILTERS: FilterState = {
  region: 'All Regions',
  category: 'All Categories',
  status: 'All',
  dateRange: 'FY 2025-2026 (Oct 2025 - Sep 2026)',
  metric: 'Revenue',
  searchQuery: ''
};

const INITIAL_BLACKBOARD_LOGS: BlackboardLog[] = [
  {
    id: 'log-boot-1',
    timestamp: '09:00:01 AM',
    tier: 'Tier 1: Intent & Orchestrator',
    event: 'SYSTEM_BOOTSTRAP',
    details: 'Initialized HostAgent FSM controller with 8 application routes and 24 registered widgets.',
    status: 'info'
  },
  {
    id: 'log-boot-2',
    timestamp: '09:00:02 AM',
    tier: 'Tier 2: Memory & Knowledge Bus',
    event: 'KNOWLEDGE_GRAPH_INDEXED',
    details: 'Vectorized schema for Executive Dashboard, Sales Report, Products, Regional, Customers, Orders.',
    status: 'success'
  },
  {
    id: 'log-boot-3',
    timestamp: '09:00:03 AM',
    tier: 'Tier 3: Execution AppAgent',
    event: 'HYBRID_CONNECTOR_READY',
    details: 'Mounted GUI action simulator and high-speed in-memory analytics engine.',
    status: 'success'
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Agent Orchestrator Ready',
    message: 'HostAgent FSM connected with 8 enterprise views and 125 benchmark tests.',
    timestamp: '10m ago',
    type: 'agent',
    read: false,
    linkPage: 'agent-blackboard'
  },
  {
    id: 'notif-2',
    title: 'High-Volume Order Stream Synced',
    message: '8,420 transaction records indexed across Karnataka, Delhi, and Maharashtra.',
    timestamp: '25m ago',
    type: 'data',
    read: false,
    linkPage: 'order-management'
  },
  {
    id: 'notif-3',
    title: 'System Health Check Passed',
    message: 'All metadata vectors and Knowledge Graph schemas validated with 0 errors.',
    timestamp: '1h ago',
    type: 'system',
    read: true,
    linkPage: 'benchmark-evaluation'
  }
];

const INITIAL_AGENT_WELCOME: AgentMessage = {
  id: 'msg-welcome',
  sender: 'agent',
  content: 'Welcome to the **Context-Aware Application Agent**! I am your chief enterprise BI companion. I understand every page, widget, data view, and filter in this platform.\n\nAsk me to navigate, filter by state or status, calculate trends, or diagnose business root causes.',
  timestamp: 'Just now',
  suggestedFollowUps: [
    'Show Karnataka sales for last quarter',
    'Compare revenue this month vs last month',
    'Top 5 products by revenue',
    'Open the product performance page',
    'Show cancelled orders',
    'Analyze sales trend for 2025'
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('login');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Business Data
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [regions] = useState<RegionalMetric[]>(INITIAL_REGIONS);
  const [monthlyTrend] = useState<MonthlyTrend[]>(INITIAL_MONTHLY_TREND);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // RBAC Change Request Queue
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);

  // Agent State
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([INITIAL_AGENT_WELCOME]);
  const [isAgentThinking, setIsAgentThinking] = useState<boolean>(false);
  const [activeExecutionPlan, setActiveExecutionPlan] = useState<AgentAction[] | null>(null);

  // Blackboard Logs
  const [blackboardLogs, setBlackboardLogs] = useState<BlackboardLog[]>(INITIAL_BLACKBOARD_LOGS);

  // User Profile & Settings
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState<boolean>(true);
  const [isApprovalsModalOpen, setIsApprovalsModalOpen] = useState<boolean>(false);

  const isAdmin = userRole === 'Admin' || userRole === 'Platform Admin' || userRole === 'Enterprise Admin';

  const hasActiveFilters =
    filters.region !== 'All Regions' ||
    filters.category !== 'All Categories' ||
    filters.status !== 'All' ||
    filters.dateRange !== 'FY 2025-2026 (Oct 2025 - Sep 2026)' ||
    (!!filters.searchQuery && filters.searchQuery.trim() !== '');

  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addBlackboardLog = useCallback((log: Omit<BlackboardLog, 'id' | 'timestamp'>) => {
    const newLog: BlackboardLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setBlackboardLogs((prev) => [newLog, ...prev]);
  }, []);

  // Notifications Handlers
  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    addNotification({
      title: 'Filters Reset',
      message: 'All regional, category, and date filters have been reset to default.',
      type: 'system'
    });
    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'FILTERS_RESET',
      details: `Reset filters to default: ${JSON.stringify(DEFAULT_FILTERS)}`,
      status: 'info'
    });
  }, [addNotification, addBlackboardLog]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage('login');
    setUserName('');
    setUserEmail('');
    addNotification({
      title: 'Session Terminated',
      message: 'You have signed out of your tenant account.',
      type: 'system',
      linkPage: 'login'
    });
  }, [addNotification]);

  // RBAC: Submit Change Request for Non-Admins
  const submitChangeRequest = useCallback((reqData: Omit<ChangeRequest, 'id' | 'timestamp' | 'status'>) => {
    const newReq: ChangeRequest = {
      ...reqData,
      id: `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      status: 'PENDING',
      timestamp: new Date().toLocaleTimeString()
    };
    setChangeRequests((prev) => [newReq, ...prev]);

    addBlackboardLog({
      tier: 'Tier 1: Intent & Orchestrator',
      event: 'RBAC_CHANGE_REQUEST_QUEUED',
      details: `Non-admin user [${reqData.requesterName}] (${reqData.requesterRole}) requested ${reqData.type} on ${reqData.entity} [${reqData.entityId}]. Queued for Admin review.`,
      status: 'warning'
    });

    addNotification({
      title: 'Approval Request Sent to Admin',
      message: `Your ${reqData.type.toLowerCase()} request for ${reqData.entity} #${reqData.entityId} has been sent for Administrator approval.`,
      type: 'approval',
      linkPage: reqData.entity === 'order' ? 'order-management' : reqData.entity === 'product' ? 'product-performance' : 'customer-directory'
    });
  }, [addBlackboardLog, addNotification]);

  const approveChangeRequest = useCallback((reqId: string) => {
    const target = changeRequests.find((r) => r.id === reqId);
    if (!target) return;

    if (target.entity === 'order') {
      if (target.type === 'DELETE') {
        setOrders((prev) => prev.filter((o) => o.id !== target.entityId));
      } else if (target.type === 'UPDATE' && target.payload?.status) {
        setOrders((prev) => prev.map((o) => o.id === target.entityId ? { ...o, status: target.payload.status } : o));
      }
    } else if (target.entity === 'product') {
      if (target.type === 'DELETE') {
        setProducts((prev) => prev.filter((p) => p.id !== target.entityId));
      } else if (target.type === 'UPDATE' && target.payload) {
        setProducts((prev) => prev.map((p) => p.id === target.entityId ? { ...p, ...target.payload } : p));
      }
    } else if (target.entity === 'customer') {
      if (target.type === 'DELETE') {
        setCustomers((prev) => prev.filter((c) => c.id !== target.entityId));
      } else if (target.type === 'UPDATE' && target.payload) {
        setCustomers((prev) => prev.map((c) => c.id === target.entityId ? { ...c, ...target.payload } : c));
      }
    }

    setChangeRequests((prev) => prev.map((r) => r.id === reqId ? { ...r, status: 'APPROVED' } : r));

    addNotification({
      title: 'Change Request Approved',
      message: `Administrator approved ${target.type} on ${target.entity} #${target.entityId}. Changes are live.`,
      type: 'approval',
      linkPage: target.entity === 'order' ? 'order-management' : target.entity === 'product' ? 'product-performance' : 'customer-directory'
    });

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'RBAC_CHANGE_REQUEST_APPROVED',
      details: `Administrator approved request ${reqId} for ${target.entity} #${target.entityId}`,
      status: 'success'
    });
  }, [changeRequests, addNotification, addBlackboardLog]);

  const rejectChangeRequest = useCallback((reqId: string) => {
    const target = changeRequests.find((r) => r.id === reqId);
    if (!target) return;

    setChangeRequests((prev) => prev.map((r) => r.id === reqId ? { ...r, status: 'REJECTED' } : r));

    addNotification({
      title: 'Change Request Rejected',
      message: `Administrator rejected ${target.type} on ${target.entity} #${target.entityId}.`,
      type: 'approval'
    });

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'RBAC_CHANGE_REQUEST_REJECTED',
      details: `Administrator rejected request ${reqId} by ${target.requesterName}`,
      status: 'warning'
    });
  }, [changeRequests, addNotification, addBlackboardLog]);

  // CRUD Operations for Orders with RBAC Guard
  const addOrder = useCallback((newOrderData: Omit<Order, 'id'>) => {
    const newId = `ORD-${1000 + orders.length + 1}`;
    const order: Order = {
      ...newOrderData,
      id: newId
    };
    setOrders((prev) => [order, ...prev]);

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_ORDER_CREATE',
      details: `Created new order ${newId} for ${order.customer} (Amount: ₹${order.amount.toLocaleString('en-IN')})`,
      status: 'success'
    });

    addNotification({
      title: 'Order Created',
      message: `Order #${newId} for ${order.customer} created with status '${order.status}'.`,
      type: 'crud',
      linkPage: 'order-management'
    });
  }, [orders.length, addBlackboardLog, addNotification]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    if (!isAdmin) {
      submitChangeRequest({
        requesterName: userName || 'Customer User',
        requesterRole: userRole,
        requesterEmail: userEmail || 'user@client.in',
        type: 'UPDATE',
        entity: 'order',
        entityId: orderId,
        description: `Update order #${orderId} status to '${status}'`,
        payload: { status }
      });
      return;
    }

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_ORDER_UPDATE',
      details: `Admin updated status of order ${orderId} to '${status}'`,
      status: 'info'
    });

    addNotification({
      title: 'Order Status Updated',
      message: `Order #${orderId} was updated to '${status}'.`,
      type: 'crud',
      linkPage: 'order-management'
    });
  }, [isAdmin, userRole, userName, userEmail, submitChangeRequest, addBlackboardLog, addNotification]);

  const deleteOrder = useCallback((orderId: string) => {
    if (!isAdmin) {
      submitChangeRequest({
        requesterName: userName || 'Customer User',
        requesterRole: userRole,
        requesterEmail: userEmail || 'user@client.in',
        type: 'DELETE',
        entity: 'order',
        entityId: orderId,
        description: `Delete order #${orderId}`,
        payload: null
      });
      return;
    }

    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_ORDER_DELETE',
      details: `Admin deleted order ${orderId}`,
      status: 'warning'
    });

    addNotification({
      title: 'Order Deleted',
      message: `Order #${orderId} has been removed from active operations.`,
      type: 'crud',
      linkPage: 'order-management'
    });
  }, [isAdmin, userRole, userName, userEmail, submitChangeRequest, addBlackboardLog, addNotification]);

  // CRUD Operations for Products with RBAC Guard
  const addProduct = useCallback((newProdData: Omit<ProductItem, 'id'>) => {
    const newId = `PRD-${200 + products.length + 1}`;
    const prod: ProductItem = { ...newProdData, id: newId };
    setProducts((prev) => [prod, ...prev]);

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_PRODUCT_CREATE',
      details: `Added new SKU ${newId}: ${prod.name}`,
      status: 'success'
    });

    addNotification({
      title: 'Product Catalog Added',
      message: `Added new item "${prod.name}" (${prod.category}) with stock ${prod.stock}.`,
      type: 'crud',
      linkPage: 'product-performance'
    });
  }, [products.length, addBlackboardLog, addNotification]);

  const updateProduct = useCallback((productId: string, updates: Partial<ProductItem>) => {
    if (!isAdmin) {
      submitChangeRequest({
        requesterName: userName || 'Customer User',
        requesterRole: userRole,
        requesterEmail: userEmail || 'user@client.in',
        type: 'UPDATE',
        entity: 'product',
        entityId: productId,
        description: `Update product SKU #${productId}`,
        payload: updates
      });
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_PRODUCT_UPDATE',
      details: `Updated product ${productId}: ${JSON.stringify(updates)}`,
      status: 'info'
    });

    addNotification({
      title: 'Product Updated',
      message: `SKU #${productId} inventory/details updated successfully.`,
      type: 'crud',
      linkPage: 'product-performance'
    });
  }, [isAdmin, userRole, userName, userEmail, submitChangeRequest, addBlackboardLog, addNotification]);

  const deleteProduct = useCallback((productId: string) => {
    if (!isAdmin) {
      submitChangeRequest({
        requesterName: userName || 'Customer User',
        requesterRole: userRole,
        requesterEmail: userEmail || 'user@client.in',
        type: 'DELETE',
        entity: 'product',
        entityId: productId,
        description: `Deactivate product SKU #${productId}`,
        payload: null
      });
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_PRODUCT_DELETE',
      details: `Deactivated SKU ${productId}`,
      status: 'warning'
    });

    addNotification({
      title: 'Product Deactivated',
      message: `SKU #${productId} removed from catalog.`,
      type: 'crud',
      linkPage: 'product-performance'
    });
  }, [isAdmin, userRole, userName, userEmail, submitChangeRequest, addBlackboardLog, addNotification]);

  // CRUD Operations for Customers with RBAC Guard
  const addCustomer = useCallback((newCustData: Omit<CustomerItem, 'id'>) => {
    const newId = `CUST-${1010 + customers.length + 1}`;
    const cust: CustomerItem = { ...newCustData, id: newId };
    setCustomers((prev) => [cust, ...prev]);

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_CUSTOMER_CREATE',
      details: `Registered client ${newId}: ${cust.name}`,
      status: 'success'
    });

    addNotification({
      title: 'Customer Registered',
      message: `Registered client "${cust.name}" from ${cust.location}.`,
      type: 'crud',
      linkPage: 'customer-directory'
    });
  }, [customers.length, addBlackboardLog, addNotification]);

  const updateCustomer = useCallback((customerId: string, updates: Partial<CustomerItem>) => {
    if (!isAdmin) {
      submitChangeRequest({
        requesterName: userName || 'Customer User',
        requesterRole: userRole,
        requesterEmail: userEmail || 'user@client.in',
        type: 'UPDATE',
        entity: 'customer',
        entityId: customerId,
        description: `Update customer account #${customerId}`,
        payload: updates
      });
      return;
    }

    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_CUSTOMER_UPDATE',
      details: `Updated client ${customerId}: ${JSON.stringify(updates)}`,
      status: 'info'
    });

    addNotification({
      title: 'Customer Profile Updated',
      message: `Account #${customerId} details updated.`,
      type: 'crud',
      linkPage: 'customer-directory'
    });
  }, [isAdmin, userRole, userName, userEmail, submitChangeRequest, addBlackboardLog, addNotification]);

  const deleteCustomer = useCallback((customerId: string) => {
    if (!isAdmin) {
      submitChangeRequest({
        requesterName: userName || 'Customer User',
        requesterRole: userRole,
        requesterEmail: userEmail || 'user@client.in',
        type: 'DELETE',
        entity: 'customer',
        entityId: customerId,
        description: `Archive customer #${customerId}`,
        payload: null
      });
      return;
    }

    setCustomers((prev) => prev.filter((c) => c.id !== customerId));

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'CRUD_CUSTOMER_DELETE',
      details: `Archived customer ${customerId}`,
      status: 'warning'
    });

    addNotification({
      title: 'Customer Archived',
      message: `Client #${customerId} removed from active roster.`,
      type: 'crud',
      linkPage: 'customer-directory'
    });
  }, [isAdmin, userRole, userName, userEmail, submitChangeRequest, addBlackboardLog, addNotification]);

  const regenerateSyntheticData = useCallback((multiplier = 1.0) => {
    const dataset = generateSyntheticTenantDataset(multiplier);
    setOrders(dataset.orders);
    setCustomers(dataset.customers);

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'SYNTHETIC_DATA_REGENERATED',
      details: `Generated ${dataset.orders.length} orders and ${dataset.customers.length} customer records.`,
      status: 'success'
    });

    addNotification({
      title: 'Synthetic Dataset Refreshed',
      message: `Generated ${dataset.orders.length} orders and ${dataset.customers.length} customer accounts.`,
      type: 'data',
      linkPage: 'executive-dashboard'
    });
  }, [addBlackboardLog, addNotification]);

  // Voice Speech Synthesis Handler
  const speakAgentResponse = useCallback((text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '').slice(0, 180);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, [isVoiceEnabled]);

  // Core Agent Prompt Submission
  const submitUserPrompt = useCallback(async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: AgentMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString()
    };

    setAgentMessages((prev) => [...prev, userMsg]);
    setIsAgentThinking(true);

    try {
      const result = await agentEngine.processUserPrompt(promptText, {
        currentPage,
        currentFilters: filters,
        orders,
        products,
        customers,
        regions,
        monthlyTrend
      });

      if (result.blackboardLogs.length > 0) {
        setBlackboardLogs((prev) => [...result.blackboardLogs, ...prev]);
      }

      if (result.message.actions && result.message.actions.length > 0) {
        setActiveExecutionPlan(result.message.actions);
      }

      if (result.newPage && result.newPage !== currentPage) {
        setCurrentPage(result.newPage);
      }

      if (result.newFilters) {
        setFilters((prev) => ({
          ...prev,
          ...result.newFilters
        }));
      }

      if (result.syntheticDataMultiplier) {
        regenerateSyntheticData(result.syntheticDataMultiplier);
      }

      setAgentMessages((prev) => [...prev, result.message]);

      // Add Notification of task completion
      addNotification({
        title: 'Agent Task Completed',
        message: `Dispatched actions for: "${promptText.slice(0, 50)}${promptText.length > 50 ? '...' : ''}"`,
        type: 'agent',
        linkPage: result.newPage || currentPage
      });

      speakAgentResponse(result.message.content);
    } catch (err: any) {
      const errorMsg: AgentMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'system',
        content: `Error processing request: ${err?.message || 'Unknown error'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setAgentMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAgentThinking(false);
      setTimeout(() => setActiveExecutionPlan(null), 4000);
    }
  }, [currentPage, filters, orders, products, customers, regions, monthlyTrend, regenerateSyntheticData, speakAgentResponse, addNotification]);

  const clearChat = useCallback(() => {
    setAgentMessages([INITIAL_AGENT_WELCOME]);
    setActiveExecutionPlan(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        orders,
        products,
        customers,
        regions,
        monthlyTrend,
        regenerateSyntheticData,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        agentMessages,
        isAgentThinking,
        activeExecutionPlan,
        submitUserPrompt,
        clearChat,
        blackboardLogs,
        addBlackboardLog,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        isAuthenticated,
        setIsAuthenticated,
        userName,
        setUserName,
        userRole,
        setUserRole,
        userEmail,
        setUserEmail,
        logout,
        hasActiveFilters,
        isApprovalsModalOpen,
        setIsApprovalsModalOpen,
        changeRequests,
        submitChangeRequest,
        approveChangeRequest,
        rejectChangeRequest,
        isVoiceEnabled,
        setIsVoiceEnabled,
        isAgentPanelOpen,
        setIsAgentPanelOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

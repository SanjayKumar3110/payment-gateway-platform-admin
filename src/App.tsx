import { useState } from 'react';
import './App.css';
import { 
  LayoutDashboard, CreditCard, ListOrdered, FileText, Users, 
  Settings, Bell, Moon, Sun,
  Hexagon,} from 'lucide-react';

import { TransactionsTable } from './components/TransactionsTable';
import { Dashboard } from './components/DashboardView';
import { PaymentsView } from './components/PaymentsPanel';
import { InvoicesView } from './components/InvoicesPanel';
import { CustomersView } from './components/CustomersPanel';

type Tab = 'dashboard' | 'payments' | 'transactions' | 'invoices' | 'customers' ; //| 'reports' | 'licenses'

const PAGE_TITLES: Record<Tab, string> = {
  dashboard: 'Dashboard',
  payments: 'Payments',
  transactions: 'Transactions',
  invoices: 'Invoices',
  customers: 'Customers'
};

export default function App() {
  const [token] = useState<string | null>('mock-token-for-ui');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  if (!token) {
    return <div style={{ padding: '32px' }}>Please Login</div>;
  }

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'transactions', icon: ListOrdered, label: 'Transactions' },
    { id: 'invoices', icon: FileText, label: 'Invoices' },
    { id: 'customers', icon: Users, label: 'Customers' },
  ];

  return (
    <div className={`app-container${darkMode ? ' dark' : ''}`}>
      {/* Sidebar — fixed 220px */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Hexagon className="icon" />
          <span>PayPlatform</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button 
              key={item.id} 
              className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id as Tab)}
            >
              <item.icon className="icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="sidebar-bottom">
          {/* <button className="nav-btn" title="Messages">
            <MessageSquare className="icon" />
            <span>Messages</span>
          </button> */}
          {/* Dark Mode Toggle — functional */}
          <button 
            className="nav-btn" 
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            onClick={() => setDarkMode(prev => !prev)}
          >
            {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="nav-btn" title="Settings">
            <Settings className="icon" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        
        {/* Topbar */}
        <header className="topbar">
          <h1 className="page-title">{PAGE_TITLES[activeTab]}</h1>
          
          {/* <div className="top-search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input type="text" className="search-input" placeholder="Search anything..." />
            </div>
          </div> */}
          
          <div className="top-actions">
            {/* <button className="btn-create">Create</button> */}
            <button className="icon-btn-circle"><Bell size={18} /></button>
            {/* <button className="icon-btn-circle"><MessageSquare size={18} /></button> */}
            <div className="avatar">JD</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content-area-scrollable">
          {activeTab === 'dashboard'    && <Dashboard />}
          {activeTab === 'payments'     && <PaymentsView />}
          {activeTab === 'transactions' && <TransactionsTable />}
          {activeTab === 'invoices'     && <InvoicesView />}
          {activeTab === 'customers'    && <CustomersView />}
        </main>
        
      </div>
    </div>
  );
}

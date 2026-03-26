import { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  LayoutDashboard, CreditCard, ListOrdered, FileText,
  Settings, Bell, Moon, Sun, Search,
  Hexagon, LogOut, Menu, X,
} from 'lucide-react';

import { LoginPage } from './pages/Login';
import { Payments } from './pages/Payments';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Invoices } from './pages/Invoices';
import { SettingsPanel } from './pages/Settings';

type Tab = 'dashboard' | 'analytics' | 'payments' | 'invoices' | 'settings';

const PAGE_TITLES: Record<Tab, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  payments: 'Payments',
  invoices: 'Invoices',
  settings: 'Settings'
};

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close sidebar by default on small screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setSidebarOpen(!e.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!token) {
    return <LoginPage onLogin={(email) => setToken(email)} />;
  }

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analytics', icon: CreditCard, label: 'Analytics' },
    { id: 'payments', icon: ListOrdered, label: 'Payments' },
    { id: 'invoices', icon: FileText, label: 'Invoices' },
  ];

  return (
    <div className={`app-container${darkMode ? ' dark' : ''}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — fixed 220px */}
      <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ' sidebar-closed'}`}>
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
          <button className="nav-btn" title="Settings" onClick={() => setActiveTab('settings')}>
            <Settings className="icon" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">

        {/* Topbar */}
        <header className="topbar">
          {/* Hamburger — visible on mobile */}
          <button className="hamburger-btn" onClick={() => setSidebarOpen(prev => !prev)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="page-title">{PAGE_TITLES[activeTab]}</h1>

          <div className="top-search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input type="text" className="search-input" placeholder="Search anything..." />
            </div>
          </div>

          <div className="top-actions">
            {/* <button className="btn-create">Create</button> */}
            <button className="icon-btn-circle"><Bell size={18} /></button>
            {/* <button className="icon-btn-circle"><MessageSquare size={18} /></button> */}
            <div className="avatar-container" style={{ position: 'relative' }} ref={menuRef}>
              <div className="avatar" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ cursor: 'pointer' }}>
                JD
              </div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  background: 'var(--surface)',
                  backdropFilter: 'var(--glass-blur)',
                  WebkitBackdropFilter: 'var(--glass-blur)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px',
                  width: '240px',
                  boxShadow: 'var(--glass-shadow)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>John Doe</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>admin@payplatform.in</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '4px' }}>ID: USR-9821</span>
                  </div>

                  <button
                    className="nav-btn"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px', margin: 0, border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                    onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                  >
                    <Settings className="icon" size={16} />
                    <span>Settings</span>
                  </button>

                  <button className="nav-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px', margin: 0, color: '#FF4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} onClick={() => { setToken(null); setShowProfileMenu(false); }}>
                    <LogOut className="icon" size={16} color="#FF4444" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content-area-scrollable">
          {activeTab === 'dashboard' && <Dashboard
            showMorePayments={() => setActiveTab('payments')} />}

          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'payments' && <Payments />}
          {activeTab === 'invoices' && <Invoices />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>

      </div>
    </div>
  );
}

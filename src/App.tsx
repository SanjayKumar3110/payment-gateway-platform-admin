import { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  LayoutDashboard, CreditCard, ListOrdered, FileText,
  Settings, Bell, Moon, Sun, Search,
  Hexagon, LogOut, Menu, X,
} from 'lucide-react';

import { Payments } from './components/PaymentsPanel';
import { Dashboard } from './components/DashboardView';
import { Analytics } from './components/AnalyticsPanel';
import { Invoices } from './components/InvoicesPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { LoginPage } from './Login/login';

type Tab = 'dashboard' | 'analytics' | 'payments' | 'invoices' | 'settings';

const PAGE_TITLES: Record<Tab, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  payments: 'Payments',
  invoices: 'Invoices',
  settings: 'Settings'
};

export default function App() {
// 1. Check localStorage before defaulting to null
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('payplatform_token');
  });

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

  
  // Update this function to accept the token
  // 3. Handle the Login Action
  const handleLogin = (_email: string, receivedToken: string) => {
    console.log("Login successful! Token received:", receivedToken);
    setToken(receivedToken); 
    
    // Save the token to the browser so they stay logged in
    localStorage.setItem('payplatform_token', receivedToken);
  };

  // 4. Handle the Logout Action
  const handleLogout = () => {
    setToken(null); // Clear from React state
    setShowProfileMenu(false); 
    setActiveTab('dashboard'); 
    
    // Wipe the token from the browser
    localStorage.removeItem('payplatform_token');
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
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
            <span>Setting</span>
          </button>
          <button className="nav-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px', margin: 0, color: '#FF4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} 
          onClick={() => handleLogout()}>
            <LogOut className="icon" size={16} color="#FF4444" />
            <span color='#FF4444'>Sign Out</span>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1.5px solid rgba(180, 195, 215, 0.8)',
                  borderRadius: '12px',
                  padding: '16px',
                  width: '240px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 1px 1px 0 rgba(255,255,255,0.8)',
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

                  <button className="nav-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px', margin: 0, color: '#FF4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} 
                  onClick={() => { handleLogout()}}>
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

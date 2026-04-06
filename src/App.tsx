import { useState, useEffect, useRef } from 'react';
import './App.css';
import { LayoutDashboard, CreditCard, ListOrdered, FileText, Settings, Bell, Moon, Sun, Search, Hexagon, LogOut } from 'lucide-react';

import { LoginPage } from './Login/login';
import { Payments } from './components/PaymentsPanel';
import { Dashboard } from './components/DashboardView';
import { Analytics } from './components/AnalyticsPanel';
import { Invoices } from './components/InvoicesPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { NotifyWindow } from './components/NotificationWindow';
import { NotificationsPanel } from './components/NotificationsPanel';
import { useNotifications } from './components/utils/NotifyUtils';

interface UserData {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  phone?: string;
  role: string;
}

type Tab = 'dashboard' | 'analytics' | 'payments' | 'invoices' | 'settings' | 'notifications';

const PAGE_TITLES: Record<Tab, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  payments: 'Payments',
  invoices: 'Invoices',
  settings: 'Settings',
  notifications: 'Notifications'
};

export default function App() {
  // 1. Check localStorage before defaulting to null
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('payplatform_token');
  });

  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('payplatform_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    notifications,
    unreadCount,
    toggleNotificationRead,
    markAllNotificationsRead,
    clearNotifications
  } = useNotifications();

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // 3. Handle the Login/Signup Action
  const handleLogin = (_email: string, receivedToken: string, user: UserData) => {
    console.log("Login successful! Token received:", receivedToken);
    setToken(receivedToken);
    setUserData(user);

    // Save both token and user data
    localStorage.setItem('payplatform_token', receivedToken);
    localStorage.setItem('payplatform_user', JSON.stringify(user));
  };

  // 4. Handle the Logout Action
  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    setShowProfileMenu(false);
    setActiveTab('dashboard');

    // Wipe token and user data from the browser
    localStorage.removeItem('payplatform_token');
    localStorage.removeItem('payplatform_user');
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }
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

        <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className='sep-line'>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary, #888)', padding: '1px 12px', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Main Menu</h3>
            <button
              style={{ fontSize: '14px' }}
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard className="icon" />
              <span>Dashboard</span>
            </button>
            <button
              style={{ fontSize: '14px' }}
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <CreditCard className="icon" />
              <span>Analytics</span>
            </button>
          </div>

          <div className='sep-line'>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary, #888)', padding: '0 12px', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Transaction</h3>
            <button
              style={{ fontSize: '14px' }}
              className={`nav-btn ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <ListOrdered className="icon" />
              <span>Payments</span>
            </button>
            <button
              style={{ fontSize: '14px' }}
              className={`nav-btn ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              <FileText className="icon" />
              <span>Invoices</span>
            </button>
          </div>

          <div>
            <h3 style={{ fontSize: '11px', color: 'var(--text-secondary, #888)', padding: '0 12px', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>General</h3>
            <button
              className={`nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              style={{ fontSize: '14px', position: 'relative' }}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="icon" />
              <span>Notifications</span>
              {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
            </button>



            <button
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}
              style={{ fontSize: '14px' }}>
              <Settings className="icon" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-btn"
            style={{ fontSize: '14px' }}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            onClick={() => setDarkMode(prev => !prev)}
          >
            {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="nav-btn" style={{ fontSize: '14px', width: '100%', justifyContent: 'flex-start', padding: '10px 12px', margin: 0, color: '#FF4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}

            onClick={() => handleLogout()}>
            <LogOut className="icon" size={16} color="#FF4444" />
            <span style={{ color: '#FF4444' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">

        {/* Topbar */}
        <header className="topbar">
          <h1 className="page-title">{PAGE_TITLES[activeTab]}</h1>

          <div className="top-search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input type="text" className="search-input" placeholder="Search anything..." />
            </div>
          </div>

          <div className="top-actions">
            {/* <button className="btn-create">Create</button> */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="icon-btn-circle" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={18} />
                <div style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, backgroundColor: '#FF4444', borderRadius: '50%' }} />
              </button>
              {showNotifications && (
                <NotifyWindow
                  onClose={() => setShowNotifications(false)}
                  darkMode={darkMode}
                  notifications={notifications}
                  onToggleRead={toggleNotificationRead}
                  onMarkAllRead={markAllNotificationsRead}
                  onNavigate={(tab) => { setActiveTab(tab as any); setShowNotifications(false); }}
                />
              )}
            </div>
            {/* <button className="icon-btn-circle"><MessageSquare size={18} /></button> */}
            <div className="avatar-container" style={{ position: 'relative' }} ref={menuRef}>
              <div className="avatar" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ cursor: 'pointer' }}>
                {userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'JD'}
              </div>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  backgroundColor: darkMode ? 'rgba(20, 20, 28, 0.95)' : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: darkMode ? '1.5px solid rgba(255, 255, 255, 0.12)' : '1.5px solid rgba(180, 195, 215, 0.8)',
                  borderRadius: '12px',
                  padding: '16px',
                  width: '240px',
                  boxShadow: darkMode
                    ? '0 8px 32px rgba(0,0,0,0.5), inset 1px 1px 0 rgba(255,255,255,0.08)'
                    : '0 8px 32px rgba(0,0,0,0.12), inset 1px 1px 0 rgba(255,255,255,0.8)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{userData?.name || 'John Doe'}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{userData?.email || 'admin@payplatform.in'}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '4px' }}>ID: {userData?.id || 'USR-9821'}</span>
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
                    onClick={() => { handleLogout() }}>
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
          {activeTab === 'settings' && <SettingsPanel userData={userData} darkMode={darkMode} setDarkMode={setDarkMode} />}
          {activeTab === 'notifications' && (
            <NotificationsPanel
              darkMode={darkMode}
              notifications={notifications}
              onToggleRead={toggleNotificationRead}
              onMarkAllRead={markAllNotificationsRead}
              onClearAll={clearNotifications}
            />
          )}
        </main>

      </div>
    </div>
  );
}

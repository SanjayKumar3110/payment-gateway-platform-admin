import { useState, useEffect } from 'react';
import './MobileApp.css';
import { 
  MobileHeader, 
  MobileBottomNav 
} from './components/Navigation';
import { 
  MobileDashboard, 
  MobilePaymentList 
} from './components/Views';
import { MobileNotifications } from './components/MobileNotifications';
import { MobileSettings } from './components/MobileSettings';
import { MobilePaymentDetails } from './components/MobilePaymentDetails';
import { LoginPage } from '../Login/login';
import type { 
  UserData, 
  Notification, 
  AppTab, 
  PaymentItem 
} from '../shared/types';
import NOTIFICATIONS_DATA from '../../data/notifications.json';
import PAYMENTS_DATA from '../../data/payments.json';

export default function MobileApp() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('payplatform_token'));
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('payplatform_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA as Notification[]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('payplatform_darkmode');
    return saved ? JSON.parse(saved) : true;
  });

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('payplatform_darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogin = (_email: string, receivedToken: string, user: UserData) => {
    setToken(receivedToken);
    setUserData(user);
    localStorage.setItem('payplatform_token', receivedToken);
    localStorage.setItem('payplatform_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem('payplatform_token');
    localStorage.removeItem('payplatform_user');
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const selectedPayment = PAYMENTS_DATA.find(p => p.id === selectedPaymentId) as PaymentItem | undefined;

  return (
    <div className={`mobile-container ${darkMode ? 'dark' : ''}`}>
      <MobileHeader 
        title={activeTab === 'dashboard' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
        onNotifications={() => setActiveTab('notifications')}
      />

      <main className="mobile-content-wrapper" style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'dashboard' && (
          <MobileDashboard 
            stats={{ 
              totalRevenue: '$128,430', 
              successRate: '98.2%', 
              activeUsers: '1.2k' 
            }} 
          />
        )}
        {activeTab === 'payments' && (
          <MobilePaymentList 
            payments={PAYMENTS_DATA.slice(0, 20) as PaymentItem[]} 
            onViewDetails={(id) => setSelectedPaymentId(id)}
          />
        )}
        {activeTab === 'notifications' && (
          <MobileNotifications 
            notifications={notifications}
            onToggleRead={toggleRead}
            onMarkAllRead={markAllRead}
            onClearAll={clearAll}
          />
        )}
        {activeTab === 'settings' && (
          <MobileSettings 
            userData={userData}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode(!darkMode)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {selectedPayment && (
        <MobilePaymentDetails 
          payment={selectedPayment} 
          onClose={() => setSelectedPaymentId(null)} 
        />
      )}

      <MobileBottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        unreadCount={unreadCount}
      />
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MobileApp.css';
import { MobileHeader } from './components/Navigation';
import { MobileDashboard, MobilePaymentList } from './components/Views';
import { MobileNotifications } from './components/MobileNotifications';
import { MobileSettings } from './components/MobileSettings';
import { MobilePaymentDetails } from './components/MobilePaymentDetails';
import { LoginPage } from '../Login/login';
import type { UserData, Notification, AppTab, PaymentItem } from '../shared/types';
import NOTIFICATIONS_DATA from '../../data/notifications.json';
import PAYMENTS_DATA from '../../data/payments.json';

const tabs: AppTab[] = ['dashboard', 'payments', 'notifications', 'settings'];

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    filter: 'blur(10px)'
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)'
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    filter: 'blur(10px)'
  })
};

export default function MobileApp() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('payplatform_token'));
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('payplatform_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [direction, setDirection] = useState(0); 
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA as Notification[]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('payplatform_darkmode');
    return saved ? JSON.parse(saved) : true;
  });

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const paginate = (newDirection: number) => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = currentIndex + newDirection;
    
    if (nextIndex >= 0 && nextIndex < tabs.length) {
      setDirection(newDirection);
      setActiveTab(tabs[nextIndex]);
      setIsHeaderCollapsed(false);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const currentScrollY = contentRef.current.scrollTop;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY > 20) {
        if (scrollDelta > 5) {
          setIsHeaderCollapsed(true);
        } else if (scrollDelta < -5) {
          setIsHeaderCollapsed(false);
        }
      } else {
        setIsHeaderCollapsed(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MobileDashboard stats={{ totalRevenue: '$128,430', successRate: '98.2%', activeUsers: '1.2k' }} />;
      case 'payments':
        return <MobilePaymentList payments={PAYMENTS_DATA.slice(0, 20) as PaymentItem[]} onViewDetails={(id) => setSelectedPaymentId(id)} />;
      case 'notifications':
        return <MobileNotifications notifications={notifications} onToggleRead={toggleRead} onMarkAllRead={markAllRead} onClearAll={clearAll} />;
      case 'settings':
        return <MobileSettings userData={userData} darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className={`mobile-container ${darkMode ? 'dark' : ''}`} style={{ overflow: 'hidden', height: '100vh', width: '100%' }}>
      <MobileHeader 
        title={activeTab === 'dashboard' ? 'NuPay' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
        activeTab={activeTab}
        onTabChange={(tab) => {
          const newIndex = tabs.indexOf(tab);
          const oldIndex = tabs.indexOf(activeTab);
          setDirection(newIndex > oldIndex ? 1 : -1);
          setActiveTab(tab);
          setIsHeaderCollapsed(false);
          if (contentRef.current) contentRef.current.scrollTop = 0;
        }}
        isCollapsed={isHeaderCollapsed}
        unreadCount={unreadCount}
      />

      <main 
        className="mobile-content-wrapper" 
        ref={contentRef}
        style={{ touchAction: 'pan-y' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              filter: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500;
              if (swipe && offset.x > 0) {
                paginate(-1); // Swipe right -> Go left
              } else if (swipe && offset.x < 0) {
                paginate(1); // Swipe left -> Go right
              }
            }}
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header Clearance Spacer */}
            <div style={{ 
              height: 'var(--mobile-header-height)', 
              flexShrink: 0,
              pointerEvents: 'none'
            }} />
            
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedPaymentId && selectedPayment && (
          <MobilePaymentDetails 
            payment={selectedPayment} 
            onClose={() => setSelectedPaymentId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

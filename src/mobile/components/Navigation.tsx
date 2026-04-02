import { 
  LayoutDashboard, 
  CreditCard, 
  Bell, 
  Settings,
  Hexagon
} from 'lucide-react';
import type { AppTab } from '../../shared/types';

interface MobileHeaderProps {
  onSearch?: () => void;
  onNotifications?: () => void;
  title: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, onNotifications }) => {
  return (
    <header className="mobile-header">
      <div className="p-app-logo">
        <Hexagon size={24} color="#4F46E5" fill="#4F46E5" fillOpacity={0.1} />
        <span>{title}</span>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onNotifications} style={{ background: 'none', border: 'none', position: 'relative', padding: '8px' }}>
          <Bell size={22} color="var(--text-primary)" />
        </button>
      </div>
    </header>
  );
};

interface MobileBottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  unreadCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onTabChange, unreadCount }) => {
  const tabs: { id: AppTab; icon: any; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`p-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="icon" />
            <span>{tab.label}</span>
            {tab.id === 'notifications' && unreadCount ? (
              <span className="p-nav-badge">{unreadCount}</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
};

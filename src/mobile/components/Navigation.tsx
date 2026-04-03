import { 
  Hexagon,
  Search,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { AppTab } from '../../shared/types';

interface MobileHeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  title: string;
  isCollapsed: boolean;
  unreadCount?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  title, 
  activeTab, 
  onTabChange, 
  isCollapsed,
  unreadCount 
}) => {
  const tabs: { id: AppTab; label: string }[] = [
    { id: 'dashboard', label: 'Home' },
    { id: 'payments', label: 'Payments' },
    { id: 'notifications', label: 'Alerts' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className={`mobile-header ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="header-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--accent-gradient)', 
            padding: '6px', 
            borderRadius: '10px',
            boxShadow: '0 4px 10px var(--accent-soft)'
          }}>
            <Hexagon size={16} color="white" fill="white" fillOpacity={0.2} strokeWidth={2.5} />
          </div>
          <span className="header-title">{title}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ 
            background: 'rgba(0,0,0,0.05)', 
            border: 'none', 
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Search size={18} strokeWidth={2.5} />
          </button>
          <button 
            style={{ 
              background: 'rgba(0,0,0,0.05)', 
              border: 'none', 
              borderRadius: '10px',
              padding: '8px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="header-nav-bar">
        <div className="top-segmented-nav">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`top-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <span style={{ position: 'relative', zIndex: 10 }}>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="top-nav-active"
                    className="nav-active-bg"
                    style={{ left: 0, right: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {tab.id === 'notifications' && unreadCount ? (
                  <span style={{ 
                    position: 'absolute', top: '10px', right: '4px', 
                    background: '#EF4444', height: '6px', width: '6px', 
                    borderRadius: '50%', border: '2px solid var(--surface-solid)',
                    zIndex: 11
                  }} />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

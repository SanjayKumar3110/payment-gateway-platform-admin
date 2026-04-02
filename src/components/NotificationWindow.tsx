import { useState } from 'react';
import { Settings, CheckCircle2, ArrowUpCircle, CheckCheck, Maximize2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'update' | 'setup';
  title: string;
  description: string;
  time: string;
  read: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
  hasAction?: boolean;
}

interface NotificationPanelProps {
  onClose: () => void;
  darkMode?: boolean;
  notifications: Notification[];
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate?: (tab: string) => void;
}

export function NotifyWindow({ darkMode, notifications, onToggleRead, onMarkAllRead, onClose, onNavigate }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'unread' | 'Settings'>('inbox');

  const markAllAsRead = () => {
    onMarkAllRead();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'update': return <ArrowUpCircle size={20} color="#8b5cf6" />;
      case 'setup': return <CheckCircle2 size={20} color="#10b981" />;
      default: return <Settings size={20} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 15px)',
      right: '-50px', // Center relatively below bell
      width: '380px',
      backgroundColor: darkMode ? '#14141c' : '#ffffff',
      border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '16px',
      boxShadow: darkMode
        ? '0 10px 40px rgba(0,0,0,0.5)'
        : '0 10px 40px rgba(0,0,0,0.1)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left'
    }} onClick={(e) => e.stopPropagation()}>

      {/* Pointer */}
      <div style={{
        position: 'absolute',
        top: '-6px',
        right: '62px', // Align with top bell
        width: '12px',
        height: '12px',
        backgroundColor: darkMode ? '#14141c' : '#ffffff',
        transform: 'rotate(45deg)',
        borderLeft: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
        borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
        zIndex: 10
      }} />

      {/* Header */}
      <div style={{ zIndex: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={markAllAsRead}
            title="Mark all as read"
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <CheckCheck size={18} />
          </button>
          <button
            onClick={() => { onNavigate?.('notifications'); onClose(); }}
            title="Show all notifications"
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ zIndex: 11, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
        <button
          onClick={() => setActiveTab('inbox')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px 12px 0', background: 'none', border: 'none', borderBottom: activeTab === 'inbox' ? '2px solid var(--text-primary)' : '2px solid transparent', color: activeTab === 'inbox' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>
          Inbox {unreadCount > 0 && <span style={{ background: '#111', color: '#fff', fontSize: '11px', padding: '2px 6px', borderRadius: '10px' }}>{unreadCount}</span>}
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'unread' ? '2px solid var(--text-primary)' : '2px solid transparent', color: activeTab === 'unread' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>
          Unread
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { onNavigate?.('settings'); onClose(); }}
          title="Notification Settings"
          style={{ background: 'none', border: 'none', padding: 0, display: 'flex', cursor: 'pointer' }}
        >
          <Settings size={16} color="var(--text-secondary)" />
        </button>
      </div>

      <div style={{ zIndex: 11, maxHeight: '350px', overflowY: 'auto' }}>
        {(activeTab === 'unread' ? notifications.filter(n => !n.read) : notifications).slice(0, 3).map((notif) => (
          <div key={notif.id}
            onClick={() => onToggleRead(notif.id)}
            style={{ display: 'flex', gap: '12px', padding: '16px 20px', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)', position: 'relative', cursor: 'pointer', alignItems: 'flex-start' }}>
            <div style={{ position: 'relative' }}>
              {notif.user?.avatar ? (
                <img src={notif.user.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="" />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: darkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getIcon(notif.type)}
                </div>
              )}
              {notif.type === 'update' && <div style={{ position: 'absolute', bottom: 1, right: 1, width: '11px', height: '11px', borderRadius: '50%', background: '#8b5cf6', border: darkMode ? '2px solid #14141c' : '2px solid #ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />}
              {notif.type === 'setup' && <div style={{ position: 'absolute', bottom: 1, right: 1, width: '11px', height: '11px', borderRadius: '50%', background: '#10b981', border: darkMode ? '2px solid #14141c' : '2px solid #ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />}
            </div>

            <div style={{ flex: 1, paddingRight: '16px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                <strong style={{ fontWeight: 600 }}>{notif.user?.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>{notif.title}</span> <strong style={{ fontWeight: 600 }}>{notif.description}</strong>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {notif.time} • PayPlatform
              </div>

              {notif.hasAction && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button style={{ padding: '6px 16px', borderRadius: '8px', border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Decline</button>
                  <button style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Accept</button>
                </div>
              )}
            </div>

            {!notif.read && (
              <div style={{ position: 'absolute', right: '20px', top: '24px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

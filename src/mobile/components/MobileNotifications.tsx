import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Trash2,
  Check
} from 'lucide-react';
import type { Notification } from '../../shared/types';

interface MobileNotificationsProps {
  notifications: Notification[];
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const MobileNotifications: React.FC<MobileNotificationsProps> = ({ 
  notifications, 
  onToggleRead, 
  onMarkAllRead, 
  onClearAll 
}) => {
  return (
    <div className="mobile-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Recent Alerts</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onMarkAllRead} style={{ background: 'var(--accent-soft)', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: 'var(--accent)', fontWeight: 700 }}>
            Mark all
          </button>
          <button onClick={onClearAll} style={{ background: 'none', border: 'none', color: '#EF4444' }}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.6 }}>
          <Bell size={48} style={{ marginBottom: '16px' }} />
          <p style={{ fontWeight: 600 }}>All caught up!</p>
        </div>
      ) : (
        notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="mobile-card" 
            style={{ 
              padding: '16px', marginBottom: '12px', 
              opacity: notif.read ? 0.7 : 1,
              borderLeft: !notif.read ? '4px solid var(--accent)' : '1.5px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                backgroundColor: notif.type === 'setup' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {notif.type === 'setup' ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="var(--accent)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{notif.title}</h4>
                  <button onClick={() => onToggleRead(notif.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                    <Check size={18} color={notif.read ? 'var(--accent)' : 'inherit'} />
                  </button>
                </div>
                <p style={{ margin: '4px 0 8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {notif.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <Calendar size={12} />
                  <span>{notif.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

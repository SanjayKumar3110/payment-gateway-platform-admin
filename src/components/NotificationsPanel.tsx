import { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  CheckCircle2, 
  ArrowUpCircle, 
  Trash2, 
  MoreVertical,
  Check
} from 'lucide-react';

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

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'update',
    user: { name: 'System' },
    title: 'recent updates',
    description: 'v1.0.2 has been deployed successfully.',
    time: '36 mins ago',
    read: false,
  },
  {
    id: '2',
    type: 'update',
    user: { name: 'System' },
    title: 'Server Maintenance',
    description: 'Weekly backup completed at 100% success rate.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'setup',
    user: { name: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=f3f4f6' },
    title: 'setup completed',
    description: 'Your payment gateway setup is fully configured.',
    time: '3 hours ago',
    read: true,
    hasAction: true,
  },
  {
    id: '4',
    type: 'setup',
    user: { name: 'Compliance' },
    title: 'KYC Document Received',
    description: 'Your verification document is under review.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '5',
    type: 'update',
    user: { name: 'System' },
    title: 'Security Alert',
    description: 'New login detected from Mumbai, India.',
    time: '2 days ago',
    read: true,
  }
];

export function NotificationsPanel({ darkMode }: { darkMode?: boolean }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];
    
    if (activeFilter === 'unread') {
      result = result.filter(n => !n.read);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [notifications, activeFilter, searchQuery]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'update': return <ArrowUpCircle size={20} className="text-primary-600" color="#8b5cf6" />;
      case 'setup': return <CheckCircle2 size={20} className="text-green-600" color="#10b981" />;
      default: return <Bell size={20} color="#94a3b8" />;
    }
  };

  return (
    <div className="base-card" style={{ 
      minHeight: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '32px'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>All Notifications</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Stay updated with system activities and security alerts.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={markAllAsRead}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
              backgroundColor: 'var(--surface)', border: '1px solid var(--border)', 
              borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', 
              fontWeight: 500, cursor: 'pointer' 
            }}
          >
            <Check size={16} /> Mark all as read
          </button>
          <button 
            onClick={clearNotifications}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: '8px', color: '#ef4444', fontSize: '14px', 
              fontWeight: 500, cursor: 'pointer' 
            }}
          >
            <Trash2 size={16} /> Clear list
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          {['all', 'unread', 'archived'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                backgroundColor: activeFilter === f ? 'var(--border)' : 'transparent',
                color: activeFilter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '10px 12px 10px 40px', 
              backgroundColor: 'var(--surface)', border: '1px solid var(--border)', 
              borderRadius: '10px', fontSize: '14px', color: 'var(--text-primary)', outline: 'none' 
            }}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Bell size={48} color="var(--text-secondary)" style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>No notifications found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>You're all caught up!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => toggleRead(notif.id)}
                style={{ 
                  display: 'flex', gap: '16px', padding: '20px 24px', 
                  backgroundColor: notif.read ? 'var(--surface)' : (darkMode ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)'),
                  transition: 'all 0.2s', cursor: 'pointer', position: 'relative',
                  alignItems: 'flex-start'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'var(--surface)' : (darkMode ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)')}
              >
                {/* Status Dot */}
                {!notif.read && (
                  <div style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                )}

                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {notif.user?.avatar ? (
                    <img src={notif.user.avatar} style={{ width: '44px', height: '44px', borderRadius: '50%' }} alt="" />
                  ) : (
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: darkMode ? 'rgba(255,255,255,0.08)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getIcon(notif.type)}
                    </div>
                  )}
                  <div style={{ 
                    position: 'absolute', bottom: 1, right: 1, width: '13px', height: '13px', 
                    borderRadius: '50%', background: notif.type === 'update' ? '#8b5cf6' : '#10b981', 
                    border: darkMode ? '2px solid #1a1a24' : '2px solid #ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {notif.user?.name || 'System'} <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>pushed a</span> {notif.title}
                      </h4>
                      <p style={{ margin: '4px 0 0', fontSize: '14px', color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.5 }}>
                        {notif.description}
                      </p>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{notif.time}</span>
                  </div>

                  {notif.hasAction && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                      <button style={{ 
                        padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--border)', 
                        background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', 
                        fontWeight: 600, cursor: 'pointer' 
                      }}>Ignore</button>
                      <button style={{ 
                        padding: '8px 20px', borderRadius: '8px', border: 'none', 
                        background: '#8b5cf6', color: '#ffffff', fontSize: '13px', 
                        fontWeight: 600, cursor: 'pointer' 
                      }}>Review</button>
                    </div>
                  )}
                </div>

                <div className="notif-actions" style={{ display: 'flex', alignItems: 'center', opacity: 0.4 }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

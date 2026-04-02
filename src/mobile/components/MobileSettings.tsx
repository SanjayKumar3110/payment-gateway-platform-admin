import React from 'react';
import { 
  Moon, 
  Sun, 
  Shield, 
  LogOut, 
  ChevronRight,
  Bell,
  HelpCircle
} from 'lucide-react';
import type { UserData } from '../../shared/types';

interface MobileSettingsProps {
  userData: UserData | null;
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const MobileSettings: React.FC<MobileSettingsProps> = ({ 
  userData, 
  darkMode, 
  onToggleTheme, 
  onLogout 
}) => {
  return (
    <div className="mobile-content">
      <div className="mobile-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--accent-soft)', border: 'none' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          background: 'var(--surface)', margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 800, color: 'var(--accent)',
          border: '4px solid var(--accent)'
        }}>
          {userData?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800 }}>{userData?.name || 'User'}</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>{userData?.email}</p>
      </div>

      <h4 style={{ margin: '24px 0 12px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.5px' }}>Preferences</h4>
      <div className="mobile-card" style={{ padding: '0' }}>
        <div onClick={onToggleTheme} style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--border)', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {darkMode ? <Moon size={18} color="var(--accent)" /> : <Sun size={18} color="var(--accent)" />}
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Dark Mode</span>
          </div>
          <div style={{ 
            width: '48px', 
            height: '24px', 
            borderRadius: '20px', 
            background: darkMode ? 'var(--accent)' : 'rgba(0,0,0,0.1)', 
            position: 'relative', 
            transition: '0.3s' 
          }}>
            <div style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              background: 'white', 
              position: 'absolute', 
              top: '3px', 
              left: darkMode ? '27px' : '3px', 
              transition: '0.3s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} color="#10B981" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Push Notifications</span>
          </div>
          <ChevronRight size={18} color="var(--text-secondary)" />
        </div>

        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="#EF4444" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Privacy & Security</span>
          </div>
          <ChevronRight size={18} color="var(--text-secondary)" />
        </div>
      </div>

      <h4 style={{ margin: '24px 0 12px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.5px' }}>Account</h4>
      <div className="mobile-card" style={{ padding: '0', overflow: 'hidden' }}>
        <button onClick={onLogout} style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: '#EF4444', fontWeight: 800, fontSize: '15px', textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={18} color="#EF4444" />
          </div>
          Logout Session
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: '20px 0 40px', opacity: 0.5 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <HelpCircle size={14} />
          <span style={{ fontSize: '12px', fontWeight: 700 }}>Version 2.4.0 (Stable)</span>
        </div>
      </div>
    </div>
  );
};

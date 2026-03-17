import { Phone, Mail, ChevronRight } from 'lucide-react';
import './css/components.css';

const CUSTOMERS = [
  { name: 'Alice Doe', phone: '+91 98765 43210', email: 'alice@store.in', orders: 14, spend: '₹21,500', joined: 'Jan 2026', initial: 'A', color: '#9b59b6' },
  { name: 'Bob Smith', phone: '+91 91234 56789', email: 'bob@store.in', orders: 7, spend: '₹8,200', joined: 'Feb 2026', initial: 'B', color: '#34495e' },
  { name: 'Charlie', phone: '+91 90012 34567', email: 'charlie@store.in', orders: 22, spend: '₹56,000', joined: 'Dec 2025', initial: 'C', color: '#e67e22' },
  { name: 'Dave L.', phone: '+91 88800 11122', email: 'dave@store.in', orders: 3, spend: '₹2,100', joined: 'Mar 2026', initial: 'D', color: '#f1c40f' },
  { name: 'Eve', phone: '+91 77711 22233', email: 'eve@store.in', orders: 9, spend: '₹12,700', joined: 'Feb 2026', initial: 'E', color: '#1abc9c' },
];

export function CustomersView() {
  return (
    <div>
      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Customers', value: '1,293', sub: '↓ 36.8% vs last month', subColor: '#FF4444' },
          { label: 'Active Today', value: '857', sub: '↑ 12.3% vs yesterday', subColor: '#4CAF50' },
          { label: 'New This Month', value: '134', sub: 'Since March 1st', subColor: undefined },
        ].map(s => (
          <div key={s.label} className="base-card cv-stat-card" style={{ flex: 1 }}>
            <div className="cv-stat-label">{s.label}</div>
            <div className="cv-stat-value">{s.value}</div>
            <div className="cv-stat-sub" style={{ color: s.subColor || 'var(--text-secondary)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Customer List */}
      <div className="base-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="cv-section-title">All Customers</h2>
          <button className="cv-add-btn">+ Add Customer</button>
        </div>

        {CUSTOMERS.map((c, i) => (
          <div key={c.name} className="cv-customer-row" style={{
            borderBottom: i < CUSTOMERS.length - 1 ? '1px solid var(--border)' : 'none'
          }}>
            <div className="cv-avatar" style={{ backgroundColor: c.color }}>{c.initial}</div>

            <div className="cv-info">
              <div className="cv-name">{c.name}</div>
              <div className="cv-contact">
                <span><Phone size={12} /> {c.phone}</span>
                <span><Mail size={12} /> {c.email}</span>
              </div>
            </div>

            <div className="cv-meta-col">
              <div className="cv-meta-value">{c.orders}</div>
              <div className="cv-meta-label">Orders</div>
            </div>

            <div className="cv-meta-col">
              <div className="cv-meta-value">{c.spend}</div>
              <div className="cv-meta-label">Total Spend</div>
            </div>

            <div className="cv-meta-col">
              <div className="cv-meta-label">Joined</div>
              <div className="cv-meta-value" style={{ fontSize: '13px' }}>{c.joined}</div>
            </div>

            <button className="cv-arrow-btn"><ChevronRight size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

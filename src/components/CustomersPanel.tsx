import { Phone, Mail, ChevronRight } from 'lucide-react';
import './css/components.css';

import CUSTOMERS from '../data/customers.json';

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

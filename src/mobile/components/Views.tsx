import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import type { PaymentItem } from '../../shared/types';
import { getStatusBadge, getMethodIcon } from '../../components/utils/PaymentUtils.tsx';

interface MobileDashboardProps {
  stats: {
    totalRevenue: string;
    successRate: string;
    activeUsers: string;
  };
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({ stats }) => {
  return (
    <div className="mobile-content">
      <div className="mobile-card" style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)', border: 'none', color: 'white' }}>
        <p style={{ opacity: 0.8, fontSize: '13px', fontWeight: 600 }}>Total Revenue</p>
        <h2 style={{ fontSize: '32px', margin: '8px 0', fontWeight: 800 }}>{stats.totalRevenue}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
          <TrendingUp size={16} />
          <span>+12.5% from last month</span>
        </div>
      </div>

      <div className="mobile-stat-row">
        <div className="mobile-card" style={{ padding: '16px', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginBottom: '8px' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Success Rate</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{stats.successRate}</h3>
        </div>
        <div className="mobile-card" style={{ padding: '16px', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', marginBottom: '8px' }}>
            <Clock size={18} />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Avg. Time</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>1.2s</h3>
        </div>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '24px 0 16px' }}>Quick Stats</h3>
      <div className="mobile-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Active Users</span>
            <span style={{ fontWeight: 700 }}>{stats.activeUsers}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>New Invoices</span>
            <span style={{ fontWeight: 700 }}>24</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MobilePaymentListProps {
  payments: PaymentItem[];
  onViewDetails: (id: string) => void;
}

export const MobilePaymentList: React.FC<MobilePaymentListProps> = ({ payments, onViewDetails }) => {
  const [filter, setFilter] = React.useState<'All' | 'Succeeded' | 'Pending' | 'Failed'>('All');

  const filteredPayments = React.useMemo(() => {
    if (filter === 'All') return payments;
    return payments.filter(p => p.status === filter);
  }, [payments, filter]);

  const filterOptions = ['All', 'Succeeded', 'Pending', 'Failed'] as const;

  return (
    <div className="mobile-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Recent Records</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{filteredPayments.length} Items</span>
      </div>

      <div className="filter-container">
        {filterOptions.map(opt => (
          <button
            key={opt}
            className={`filter-pill ${filter === opt ? 'active' : ''}`}
            onClick={() => setFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {filteredPayments.map((payment) => (
        <div
          key={payment.id}
          className="mobile-card"
          style={{ padding: '16px', marginBottom: '12px', cursor: 'pointer' }}
          onClick={() => onViewDetails(payment.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: 'var(--accent-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {getMethodIcon(payment.iconType)}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '15px' }}>{payment.method}</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{payment.date}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: payment.status === 'Succeeded' ? '#10B981' : 'inherit' }}>
                {payment.status === 'Succeeded' ? '+' : ''}{payment.amount} <span style={{ fontSize: '10px', verticalAlign: 'middle', opacity: 0.7 }}>USD</span>
              </p>
              <div style={{ marginTop: '6px', fontSize: '10px', display: 'inline-block' }}>
                {getStatusBadge(payment.status)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

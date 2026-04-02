import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { PaymentItem } from '../../shared/types';
import { getStatusBadge, getMethodIcon } from '../../components/utils/PaymentUtils.tsx';

interface MobileDashboardProps {
  stats: {
    totalRevenue: string;
    successRate: string;
    activeUsers: string;
  };
}

const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const MobileDashboard: React.FC<MobileDashboardProps> = ({ stats }) => {
  return (
    <motion.div 
      className="mobile-content"
      variants={containerVars}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={itemVars}
        className="mobile-card" 
        style={{ 
          background: 'var(--accent-gradient)', 
          border: 'none', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(20px, 6vw, 32px)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ opacity: 0.8, fontSize: 'var(--font-xs)', fontWeight: 600, letterSpacing: '0.1em' }}>TOTAL REVENUE</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', margin: '12px 0' }}>
            <h2 style={{ fontSize: 'var(--font-xl)', margin: 0, fontWeight: 900, lineHeight: 1 }}>{stats.totalRevenue}</h2>
            <span style={{ fontSize: 'var(--font-sm)', opacity: 0.7, marginBottom: '4px' }}>USD</span>
          </div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: 'var(--font-xs)',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: '100px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <TrendingUp size={14} />
            <span style={{ fontWeight: 700 }}>+12.5%</span>
            <span style={{ opacity: 0.8, fontWeight: 500 }}>vs last month</span>
          </div>
        </div>
        
        <div style={{ 
          position: 'absolute', top: '-10%', right: '-10%', 
          width: '40%', height: '40%', 
          background: 'rgba(255,255,255,0.15)', 
          borderRadius: '50%', 
          filter: 'blur(40px)' 
        }} />
      </motion.div>

      <div className="mobile-stat-row">
        <motion.div variants={itemVars} className="mobile-card" style={{ padding: 'clamp(14px, 4vw, 20px)', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ 
              background: 'var(--accent-soft)', 
              color: 'var(--accent)', 
              padding: '8px', 
              borderRadius: '12px' 
            }}>
              <CheckCircle2 size={18} />
            </div>
            <ArrowUpRight size={16} color="#10B981" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-xs)', fontWeight: 600, margin: '0 0 4px' }}>Success Rate</p>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, margin: 0 }}>{stats.successRate}</h3>
        </motion.div>

        <motion.div variants={itemVars} className="mobile-card" style={{ padding: 'clamp(14px, 4vw, 20px)', margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ 
              background: 'rgba(236, 72, 153, 0.1)', 
              color: '#EC4899', 
              padding: '8px', 
              borderRadius: '12px' 
            }}>
              <Clock size={18} />
            </div>
            <ArrowDownRight size={16} color="#EF4444" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-xs)', fontWeight: 600, margin: '0 0 4px' }}>Avg. Time</p>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, margin: 0 }}>1.2s</h3>
        </motion.div>
      </div>

      <motion.div variants={itemVars} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 12px' }}>
        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, margin: 0 }}>Performance</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 'var(--font-sm)', fontWeight: 700 }}>See Details</button>
      </motion.div>

      <motion.div variants={itemVars} className="mobile-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Active Users', value: stats.activeUsers, color: '#6366F1' },
            { label: 'New Invoices', value: '24', color: '#10B981' },
            { label: 'Open Disputes', value: '2', color: '#F59E0B' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', fontWeight: 500 }}>{item.label}</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 'var(--font-md)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
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
    <motion.div 
      className="mobile-content"
      variants={containerVars}
      initial="hidden"
      animate="visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Transactions</h3>
          <p style={{ margin: '4px 0 0', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing {filteredPayments.length} records
          </p>
        </div>
        <button style={{ 
          background: 'var(--surface)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--glass-border)', 
          borderRadius: '14px', 
          padding: '10px' 
        }}>
          <MoreVertical size={20} color="var(--text-secondary)" />
        </button>
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
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {filteredPayments.map((payment) => (
          <motion.div 
            variants={itemVars}
            key={payment.id} 
            className="mobile-card" 
            style={{ 
              padding: '16px', 
              marginBottom: '10px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
            onClick={() => onViewDetails(payment.id)}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '16px', 
              backgroundColor: 'var(--accent-soft)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid var(--border)'
            }}>
              {getMethodIcon(payment.iconType)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--font-md)', letterSpacing: '-0.01em' }}>{payment.method}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>{payment.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: 800, 
                    fontSize: 'var(--font-md)', 
                    color: payment.status === 'Succeeded' ? '#10B981' : 'var(--text-primary)' 
                  }}>
                    {payment.status === 'Succeeded' ? '+' : ''}{payment.amount}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {payment.status}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

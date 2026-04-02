import React from 'react';
import { 
  X, 
  Copy, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  CreditCard,
  Hash
} from 'lucide-react';
import type { PaymentItem } from '../../shared/types';
import { getStatusBadge, getMethodIcon } from '../../components/utils/utils.tsx';

interface MobilePaymentDetailsProps {
  payment: PaymentItem;
  onClose: () => void;
}

export const MobilePaymentDetails: React.FC<MobilePaymentDetailsProps> = ({ payment, onClose }) => {
  return (
    <div className="mobile-modal-overlay" onClick={onClose}>
      <div className="mobile-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Payment Details</h3>
          <button onClick={onClose} style={{ background: 'var(--border)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
            <X size={20} color="var(--text-primary)" />
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 30px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '20px', 
            backgroundColor: 'var(--accent-soft)', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {getMethodIcon(payment.iconType)}
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px' }}>
            {payment.currency === 'USD' ? '$' : ''}{payment.amount}
          </h2>
          <div style={{ display: 'inline-block' }}>
            {getStatusBadge(payment.status)}
          </div>
        </div>

        <div className="mobile-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <Hash size={14} />
              <span>Transaction ID</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px', fontFamily: 'monospace' }}>{payment.id.toUpperCase()}</span>
              <button style={{ background: 'none', border: 'none', padding: 0 }}><Copy size={14} /></button>
            </div>
          </div>

          <div style={{ padding: '16px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <Calendar size={14} />
              <span>Date & Time</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>{payment.date}</span>
          </div>

          <div style={{ padding: '16px', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <CreditCard size={14} />
              <span>Payment Method</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>{payment.method} {payment.last4 ? `•••• ${payment.last4}` : ''}</span>
          </div>

          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <ShieldCheck size={14} />
              <span>Security Check</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#10B981' }}>Verified</span>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button style={{ 
            padding: '14px', borderRadius: '14px', border: '1.5px solid var(--border)', 
            background: 'var(--surface)', fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <ExternalLink size={16} />
            Receipt
          </button>
          <button style={{ 
            padding: '14px', borderRadius: '14px', border: 'none', 
            background: 'var(--accent)', fontWeight: 700, fontSize: '14px', color: 'white'
          }}>
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

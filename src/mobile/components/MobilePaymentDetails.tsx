import React from 'react';
import { 
  X, 
  Copy, 
  Calendar, 
  ShieldCheck, 
  CreditCard,
  Hash,
  Download,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { PaymentItem } from '../../shared/types';
import { getStatusBadge, getMethodIcon } from '../../components/utils/utils.tsx';

interface MobilePaymentDetailsProps {
  payment: PaymentItem;
  onClose: () => void;
}

export const MobilePaymentDetails: React.FC<MobilePaymentDetailsProps> = ({ payment, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mobile-modal-overlay" 
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="mobile-bottom-sheet" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>Transaction details</h3>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'var(--accent-soft)', 
              border: 'none', 
              borderRadius: '14px', 
              padding: '10px', 
              cursor: 'pointer',
              color: 'var(--accent)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', padding: '10px 0 32px' }}
        >
          <div style={{ 
            width: '72px', height: '72px', borderRadius: '24px', 
            backgroundColor: 'var(--accent-soft)', margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px var(--accent-soft)'
          }}>
            {getMethodIcon(payment.iconType)}
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 900, margin: '0 0 10px', letterSpacing: '-1px' }}>
            {payment.currency === 'USD' ? '$' : ''}{payment.amount}
          </h2>
          <div style={{ display: 'inline-flex' }}>
            {getStatusBadge(payment.status)}
          </div>
        </motion.div>

        <div className="mobile-card" style={{ padding: '0', overflow: 'hidden', background: 'var(--surface-solid)', border: '1px solid var(--border)' }}>
          <DetailRow label="Transaction ID" value={payment.id.toUpperCase()} icon={<Hash size={14} />} mono copyable />
          <DetailRow label="Date & Time" value={payment.date} icon={<Calendar size={14} />} />
          <DetailRow label="Payment Method" value={`${payment.method} ${payment.last4 ? `•••• ${payment.last4}` : ''}`} icon={<CreditCard size={14} />} />
          <DetailRow label="Security status" value="Verified & Encrypted" icon={<ShieldCheck size={14} />} success />
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <button style={{ 
            padding: '16px', borderRadius: '20px', border: '1px solid var(--border)', 
            background: 'var(--surface-solid)', fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Download size={18} />
            E-Receipt
          </button>
          <button style={{ 
            padding: '16px', borderRadius: '20px', border: 'none', 
            background: 'var(--accent-gradient)', fontWeight: 800, fontSize: '15px', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: '0 10px 20px var(--accent-soft)'
          }}>
            <MessageCircle size={18} />
            Support
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
  success?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon, mono, copyable, success }) => (
  <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>
      <div style={{ color: 'var(--accent)', opacity: 0.8 }}>{icon}</div>
      <span>{label}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ 
        fontWeight: 700, 
        fontSize: '14px', 
        fontFamily: mono ? 'monospace' : 'inherit',
        color: success ? '#10B981' : 'var(--text-primary)'
      }}>{value}</span>
      {copyable && (
        <button style={{ background: 'var(--accent-soft)', border: 'none', borderRadius: '8px', padding: '6px', color: 'var(--accent)' }}>
          <Copy size={13} />
        </button>
      )}
    </div>
  </div>
);

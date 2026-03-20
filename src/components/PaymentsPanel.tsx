import { useState } from 'react';
import { CloudDownload, Plus, Search, ChevronDown, ChevronRight, Clock, CheckCircle2, XCircle, FilePlus, CreditCard, Building2, Smartphone } from 'lucide-react';
import PAYMENTS_DATA from '../data/payments.json';
import './css/components.css';

const TABS = ['All payments', 'Succeeded', 'Refunded'];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Succeeded':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <CheckCircle2 size={14} /> Succeeded
        </span>
      );
    case 'Pending':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#FFFBEB', color: '#F59E0B', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <Clock size={14} /> Pending
        </span>
      );
    case 'Declined':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#FEF2F2', color: '#EF4444', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <XCircle size={14} /> Declined
        </span>
      );
    case 'Create':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#EEF2FF', color: '#6366F1', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <FilePlus size={14} /> Create
        </span>
      );
    default:
      return null;
  }
};

const getMethodIcon = (type: string) => {
  switch (type) {
    case 'visa':
      return <CreditCard size={16} color="#1434CB" />;
    case 'mastercard':
      return <CreditCard size={16} color="#EB001B" />;
    case 'nupay':
      return <Smartphone size={16} color="#8A05BE" />;
    case 'mercadopago':
      return <CreditCard size={16} color="#009EE3" />;
    case 'bank':
      return <Building2 size={16} color="var(--text-secondary)" />;
    default:
      return <CreditCard size={16} />;
  }
};

export function Payments() {
  const [activeTab, setActiveTab] = useState('All payments');

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100%', borderRadius: '12px', padding: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Payments overview</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
            <CloudDownload size={16} /> Export
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Plus size={16} /> Payment link
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E5E7EB', marginBottom: '24px' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0 0 12px 0',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #4F46E5' : '2px solid transparent',
              color: activeTab === tab ? '#4F46E5' : 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: activeTab === tab ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-1px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
            <Clock size={14} color="var(--text-secondary)" /> Date range <ChevronDown size={14} color="var(--text-secondary)" />
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
            Flag Status <ChevronDown size={14} color="var(--text-secondary)" />
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
            <CreditCard size={14} color="var(--text-secondary)" /> P. Method <ChevronDown size={14} color="var(--text-secondary)" />
          </button>
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by amount, payment method..."
            style={{ width: '100%', padding: '8px 12px 8px 36px', backgroundColor: 'var(--surface)', border: 'none', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '16px 8px', width: '40px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>PAYMENT ID</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>STATUS</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>AMOUNT</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>P. METHOD</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>CREATION DATE</th>
              <th style={{ padding: '16px 8px', width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS_DATA.map((payment, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '16px 8px' }}><input type="checkbox" style={{ cursor: 'pointer' }} /></td>
                <td style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'monospace' }}>{payment.id}</td>
                <td style={{ padding: '16px 12px' }}>{getStatusBadge(payment.status)}</td>
                <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {payment.amount} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '13px' }}>{payment.currency}</span>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {getMethodIcon(payment.iconType)}
                    {payment.method} {payment.last4 && <span style={{ color: 'var(--text-secondary)' }}>•••• {payment.last4}</span>}
                  </div>
                </td>
                <td style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '13px' }}>{payment.date}</td>
                <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}><ChevronRight size={16} style={{ cursor: 'pointer' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
          {PAYMENTS_DATA.length} results
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Previous</button>
          <button style={{ padding: '6px 12px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Next</button>
        </div>
      </div>

    </div>
  );
}

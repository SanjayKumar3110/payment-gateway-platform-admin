import { useState, useMemo, useEffect, useRef } from 'react';
import { CloudDownload, Plus, Search, ChevronDown, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { io } from 'socket.io-client';
import PAYMENTS_DATA from '@data/payments.json';
import './css/components.css';
import { getStatusBadge, getMethodIcon } from './utils/utils.tsx';

const TABS = ['All payments', 'Succeeded', 'Refunded'];

// Custom Dropdown Component
const Dropdown = ({ label, icon: Icon, options, value, onChange }: any) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: 'var(--surface)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
      >
        {Icon && <Icon size={14} color="var(--text-secondary)" />}
        {value ? value : label}
        <ChevronDown size={14} color="var(--text-secondary)" />
      </button>

      {open && (
        <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', borderRadius: '6px', width: 'max-content', minWidth: '160px', zIndex: 100 }}>
          <div
            onClick={() => { onChange(''); setOpen(false); }}
            style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Clear Filter
          </div>
          {options.map((opt: string) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: value === opt ? '#4F46E5' : 'var(--text-primary)', backgroundColor: value === opt ? 'var(--border)' : 'transparent', fontWeight: value === opt ? 600 : 400 }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'var(--border)' }}
              onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function Payments() {
  const [activeTab, setActiveTab] = useState('All payments');
  const [dateRange, setDateRange] = useState('');
  const [flagStatus, setFlagStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [realPayments, setRealPayments] = useState<any[]>([]);

  // Fetch real payments from backend
  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments');
      if (response.ok) {
        const data = await response.json();
        setRealPayments(data);
      }
    } catch (error) {
      console.error('Failed to fetch real payments:', error);
    }
  };

  useEffect(() => {
    fetchPayments();

    // Establish WebSocket Connection
    const socket = io('http://localhost:5000');
    
    socket.on('newPayment', (payment) => {
      console.log('Live Payment Received:', payment);
      setRealPayments(prev => [payment, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Return back to first payment table when filters/tabs change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, dateRange, flagStatus, paymentMethod, searchQuery]);

  const filteredAndSortedData = useMemo(() => {
    // Combine real payments with mock data
    let data = [...realPayments, ...PAYMENTS_DATA];

    // 1. Tab Filtering
    if (activeTab === 'Succeeded') data = data.filter(p => p.status === 'Succeeded');
    if (activeTab === 'Refunded') data = data.filter(p => p.status === 'Refunded');

    // 2. Search Query
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      data = data.filter(p =>
        p.amount.toLowerCase().includes(lowerQ) ||
        p.method.toLowerCase().includes(lowerQ) ||
        p.id.toLowerCase().includes(lowerQ)
      );
    }

    // 3. Date Range Filtering
    if (dateRange) {
      const now = new Date(); // Use real current date
      data = data.filter(p => {
        const pDate = new Date(p.date.replace(' PM', '').replace(' AM', '')); // basic parse
        const diffTime = Math.abs(now.getTime() - pDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateRange === 'Today') return diffDays <= 1;
        if (dateRange === 'Last 3 days') return diffDays <= 3;
        if (dateRange === 'Week') return diffDays <= 7;
        if (dateRange === 'Month') return diffDays <= 30;
        if (dateRange === 'Last 3 months') return diffDays <= 90;
        return true;
      });
    }

    // 4. Group / Sort by Flag Status (Push selected to top)
    if (flagStatus) {
      // It says: "If user click succeed it shows all succeed payement on top and below remain status in a group"
      // Wait, "succeed", "pending", "create", "declined".
      const matchStatusStr = flagStatus === 'Successed' ? 'Succeeded' : flagStatus;

      data.sort((a, b) => {
        if (a.status === matchStatusStr && b.status !== matchStatusStr) return -1;
        if (b.status === matchStatusStr && a.status !== matchStatusStr) return 1;

        // Secondary sort: group remaining items by status alphabetically
        return a.status.localeCompare(b.status);
      });
    }

    // 5. Group / Sort by Payment Method (Push selected to top)
    if (paymentMethod) {
      data.sort((a, b) => {
        if (a.method === paymentMethod && b.method !== paymentMethod) return -1;
        if (b.method === paymentMethod && a.method !== paymentMethod) return 1;
        return a.method.localeCompare(b.method);
      });
    }

    return data;
  }, [activeTab, dateRange, flagStatus, paymentMethod, searchQuery]);

  // Pagination bounds logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100%', borderRadius: '12px', padding: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Payments overview</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
            <CloudDownload size={16} /> Export
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Plus size={16} /> Payment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 50 }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Dropdown
            label="Date range" icon={Clock} value={dateRange} onChange={setDateRange}
            options={['Today', 'Last 3 days', 'Week', 'Month', 'Last 3 months']}
          />
          <Dropdown
            label="Flag Status" value={flagStatus} onChange={setFlagStatus}
            options={['Successed', 'Pending', 'Create', 'Declined']}
          />
          <Dropdown
            label="Payment Method" icon={CreditCard} value={paymentMethod} onChange={setPaymentMethod}
            options={['Visa', 'Mastercard', 'Bank transfer', 'NuPay', 'Mercado Pago']}
          />
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by amount, payment method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>PAYMENT ID</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>STATUS</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>AMOUNT</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>PAYMENT METHOD</th>
              <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>CREATION DATE</th>
              
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((payment, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
                <td style={{ padding: '16px 8px', color: '#9CA3AF' }}><ChevronRight size={16} style={{ cursor: 'pointer' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
          {filteredAndSortedData.length === 0 ? '0 results' : `Showing ${startIndex + 1}-${Math.min(startIndex + 10, filteredAndSortedData.length)} of ${filteredAndSortedData.length} results`}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            style={{ padding: '6px 12px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: currentPage === 1 ? 0.5 : 1, fontSize: '13px', fontWeight: 500, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
            Previous
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            style={{ padding: '6px 12px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: (currentPage === totalPages || totalPages === 0) ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1, fontSize: '13px', fontWeight: 500, cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}>
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

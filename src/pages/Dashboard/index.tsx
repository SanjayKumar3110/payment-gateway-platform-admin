import { useState, useRef, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, Calendar, ChevronDown, Clock, CheckCircle2, XCircle, FilePlus, CreditCard, Building2, Smartphone } from 'lucide-react';
import { Payments } from '../Payments';
import '../../components/css/components.css';

import dashboardData from '../../data/dashboard.json';
import PAYMENTS_DATA from '../../data/payments.json';

const { pieData, barData, pieColors: PIE_COLORS } = dashboardData;

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Succeeded':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#10B981', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <CheckCircle2 size={14} /> Succeeded
        </span>
      );
    case 'Pending':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#F59E0B', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <Clock size={14} /> Pending
        </span>
      );
    case 'Declined':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#EF4444', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <XCircle size={14} /> Declined
        </span>
      );
    case 'Create':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#6366F1', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <FilePlus size={14} /> Create
        </span>
      );
    case 'Refunded':
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', color: '#4B5563', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
          <XCircle size={14} /> Refunded
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
      return <Building2 size={16} color="#4B5563" />;
    default:
      return <CreditCard size={16} />;
  }
};

export function Dashboard() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('This Month');
  const [showTimeRange, setShowTimeRange] = useState(false);
  const timeRangeRef = useRef<HTMLDivElement>(null);

  const handleShowMore = () => setIsPanelOpen(true);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (timeRangeRef.current && !timeRangeRef.current.contains(e.target as Node)) {
        setShowTimeRange(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentPieData = useMemo(() => {
    if (timeRange === 'This Week') {
      return [
        { name: 'Completed', value: 85 },
        { name: 'Processing', value: 45 },
        { name: 'Failed', value: 12 }
      ];
    } else if (timeRange === 'This Year') {
      return [
        { name: 'Completed', value: 4800 },
        { name: 'Processing', value: 1200 },
        { name: 'Failed', value: 350 }
      ];
    }
    return pieData;
  }, [timeRange]);

  const currentBarData = useMemo(() => {
    if (timeRange === 'This Week') {
      return [
        { label: 'Mon', revenue: 12000 },
        { label: 'Tue', revenue: 15000 },
        { label: 'Wed', revenue: 13000 },
        { label: 'Thu', revenue: 18000 },
        { label: 'Fri', revenue: 22000 },
        { label: 'Sat', revenue: 25000 },
        { label: 'Sun', revenue: 21000 }
      ];
    } else if (timeRange === 'This Year') {
      return barData.map(d => ({ label: d.month, revenue: d.revenue * 5 }));
    }
    return [
      { label: 'Week 1', revenue: 63000 },
      { label: 'Week 2', revenue: 88000 },
      { label: 'Week 3', revenue: 92000 },
      { label: 'Week 4', revenue: 104000 }
    ];
  }, [timeRange]);

  if (isPanelOpen) {
    return <Payments />;
  }

  return (
    <div>
      <div className="pv-row-sb" style={{ marginBottom: '24px' }}>
        <h2 className="pv-section-title">System Reports</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }} ref={timeRangeRef}>
            <button
              className="glass-action-btn small"
              onClick={() => setShowTimeRange(!showTimeRange)}
              style={{ minWidth: '130px', justifyContent: 'space-between', height: '100%', padding: '0 16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> {timeRange}
              </div>
              <ChevronDown size={14} />
            </button>

            {showTimeRange && (
              <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '130px', borderRadius: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {['This Week', 'This Month', 'This Year'].map(opt => (
                  <button
                    key={opt}
                    onClick={(e) => { e.stopPropagation(); setTimeRange(opt); setShowTimeRange(false); }}
                    style={{ padding: '8px 16px', background: timeRange === opt ? 'var(--border)' : 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                    onMouseLeave={(e) => {
                      if (timeRange !== opt) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="cv-add-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: 'auto', padding: '8px 20px' }}>
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="responsive-flex-row" style={{ marginBottom: '24px' }}>

        {/* Pie Chart */}
        <div className="base-card" style={{ flex: 1 }}>
          <h3 className="pv-product-name" style={{ fontSize: '16px', marginBottom: '4px' }}>Transaction Summary</h3>
          <p className="pv-subtext" style={{ marginBottom: '16px' }}>Live status breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={currentPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {currentPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--tooltip-text)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                  boxShadow: 'var(--glass-shadow)'
                }}
                labelStyle={{ color: 'var(--tooltip-text)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--tooltip-text-sec)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {currentPieData.map((entry, i) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: PIE_COLORS[i], display: 'inline-block' }}></span>
                {entry.name}: <strong>{entry.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="base-card" style={{ flex: 2 }}>
          <h3 className="pv-product-name" style={{ fontSize: '16px', marginBottom: '4px' }}>
            {timeRange === 'This Year' ? 'Yearly Revenue' : timeRange === 'This Week' ? 'Weekly Revenue' : 'Monthly Revenue'}
          </h3>
          <p className="pv-subtext" style={{ marginBottom: '16px' }}>
            {timeRange === 'This Year' ? 'Last 6 months' : timeRange === 'This Week' ? 'Last 7 days' : 'Last 4 weeks'}
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={currentBarData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  borderColor: 'var(--border)',
                  color: 'var(--tooltip-text)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                  boxShadow: 'var(--glass-shadow)'
                }}
                labelStyle={{ color: 'var(--tooltip-text)', fontWeight: 600, marginBottom: '4px' }}
                itemStyle={{ color: 'var(--tooltip-text-sec)' }}
              />
              <Bar dataKey="revenue" fill="#4CAF50" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Payment Table */}
      <div className="base-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '16px' }}>
          <h3 className="pv-product-name" style={{ fontSize: '16px', marginBottom: '16px' }}>Recent Payment Logs</h3>
          <button
            onClick={handleShowMore}
            style={{ padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
          >
            Show More
          </button>
        </div>

        <div className="comp-table-container">
          <table className="comp-table" style={{ borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textAlign: 'center' }}>PAYMENT ID</th>
                <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textAlign: 'center' }}>AMOUNT</th>
                <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textAlign: 'center' }}>TYPE</th>
                <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textAlign: 'center' }}>DATE</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS_DATA.slice(0, 5).map((payment, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'monospace' }}>
                    {payment.id}
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {payment.amount} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '13px' }}>{payment.currency}</span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {getMethodIcon(payment.iconType)}
                      {payment.method} {payment.last4 && <span style={{ color: 'var(--text-secondary)' }}>•••• {payment.last4}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>{getStatusBadge(payment.status)}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '13px' }}>{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


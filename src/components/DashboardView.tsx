import { useState, useRef, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { io } from 'socket.io-client';
import { Download, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import './css/components.css';

import PAYMENTS_DATA from '@data/payments.json';
import { getStatusBadge, getMethodIcon } from './utils/PaymentUtils.tsx';

const PIE_COLORS = ["#4CAF50", "#FF4444", "#ff9800", "#6a6a6aff", "#2f46adff"];

interface DashboardProps {
  showMorePayments: () => void;
}

export function Dashboard({ showMorePayments }: DashboardProps) {
  const [timeRange, setTimeRange] = useState('Overall');
  const [showTimeRange, setShowTimeRange] = useState(false);
  const [realPayments, setRealPayments] = useState<any[]>([]);
  const timeRangeRef = useRef<HTMLDivElement>(null);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments`);
      if (response.ok) {
        const data = await response.json();
        setRealPayments(data);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  useEffect(() => {
    fetchPayments();

    // Establish WebSocket Connection
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('newPayment', (payment) => {
      setRealPayments(prev => [payment, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (timeRangeRef.current && !timeRangeRef.current.contains(e.target as Node)) {
        setShowTimeRange(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredPayments = useMemo(() => {
    const allData = [...realPayments, ...PAYMENTS_DATA];
    if (timeRange === 'This Year') return allData;

    const now = new Date();

    return allData.filter(p => {
      const pDate = new Date(p.date);
      if (isNaN(pDate.getTime())) return true;

      if (timeRange === 'Today') {
        return pDate.toDateString() === now.toDateString();
      }
      if (timeRange === 'This Week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return pDate >= startOfWeek && pDate <= now;
      }
      if (timeRange === 'This Month') {
        return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
      }
      if (timeRange === 'This Year') {
        return pDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [timeRange, realPayments]);

  const currentPieData = useMemo(() => {
    const counts = { Succeeded: 0, Declined: 0, Refunded: 0, Created: 0, Pending: 0 };
    filteredPayments.forEach(p => {
      if (p.status === 'Succeeded') counts.Succeeded++;
      else if (p.status === 'Declined') counts.Declined++;
      else if (p.status === 'Pending') counts.Pending++;
      else if (p.status === 'Refunded') counts.Refunded++;
      else if (p.status === 'Create') counts.Created++;
    });

    return [
      { name: 'Succeeded', value: counts.Succeeded },
      { name: 'Declined', value: counts.Declined },
      { name: 'Pending', value: counts.Pending },
      { name: 'Refunded', value: counts.Refunded },
      { name: 'Created', value: counts.Created }
    ];
  }, [filteredPayments]);

  const currentBarData = useMemo(() => {
    const parseAmt = (amt: string) => parseFloat(amt.replace(/[^0-9.-]+/g, "")) || 0;

    if (timeRange === 'Today') {
      let total = 0;
      filteredPayments.forEach(p => total += parseAmt(p.amount));
      return [{ label: 'Today', revenue: total }];
    } else if (timeRange === 'This Week') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const data = days.map(d => ({ label: d, revenue: 0 }));
      filteredPayments.forEach(p => {
        const d = new Date(p.date).getDay();
        if (!isNaN(d)) data[d].revenue += parseAmt(p.amount);
      });
      return data;
    } else if (timeRange === 'This Month') {
      const data = [0, 1, 2, 3, 4].map(w => ({ label: `Week ${w + 1}`, revenue: 0 }));
      filteredPayments.forEach(p => {
        const dateObj = new Date(p.date);
        if (!isNaN(dateObj.getTime())) {
          const week = Math.floor(dateObj.getDate() / 7);
          if (week < 5) data[week].revenue += parseAmt(p.amount);
        }
      });
      return data;
    } else if (timeRange === 'This Year') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const data = months.map(m => ({ label: m, revenue: 0 }));
      filteredPayments.forEach(p => {
        const m = new Date(p.date).getMonth();
        if (!isNaN(m)) data[m].revenue += parseAmt(p.amount);
      });
      return data;
    } else {
      const yearMap = new Map<number, number>();
      filteredPayments.forEach(p => {
        const yr = new Date(p.date).getFullYear();
        if (!isNaN(yr)) {
          yearMap.set(yr, (yearMap.get(yr) || 0) + parseAmt(p.amount));
        }
      });
      const entries = Array.from(yearMap.entries());
      if (entries.length === 0) return [{ label: 'Overall', revenue: 0 }];
      return entries.sort((a, b) => a[0] - b[0]).map(([yr, amt]) => ({ label: yr.toString(), revenue: amt }));
    }
  }, [filteredPayments, timeRange]);

  return (
    <div>
      <div className="pv-row-sb" style={{ marginBottom: '24px' }}>
        <h2 className="pv-section-title">System Reports</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* <button className="pv-btn-outline">This Month</button> */}
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
                {['Today', 'This Week', 'This Month', 'This Year', 'Overall'].map(opt => (
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
          <h3 className="pv-product-name" style={{ fontSize: '16px', marginBottom: '4px', padding: '16px' }}>Shop Revenue</h3>
          {/* <p className="pv-subtext" style={{ marginBottom: '16px' }}>Last 6 months</p> */}
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingBottom: '16px' }}>
          <h3 className="pv-product-name" style={{ alignItems: 'center', fontSize: '16px', paddingBottom: '16px' }}>Recent Payment Logs</h3>
          <button
            onClick={showMorePayments}
            style={{ padding: '12px 12px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', opacity: 1, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            Show More
          </button>
        </div>

        <div className="comp-table-container" >
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
              {[...realPayments, ...PAYMENTS_DATA].slice(0, 5).map((payment, idx) => (
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {getMethodIcon(payment.iconType)}
                      {payment.method} {payment.last4 && <span style={{ color: 'var(--text-secondary)' }}>•••• {payment.last4}</span>}
                    </div>
                  </td>

                  <td style={{ padding: '16px 12px' }}>{getStatusBadge(payment.status)}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '13px' }}>{payment.date}</td>
                  <td style={{ padding: '16px 8px', color: '#9CA3AF' }}><ChevronRight size={16} style={{ cursor: 'pointer' }} /></td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>

  );
}

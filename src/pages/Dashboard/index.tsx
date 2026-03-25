import { useState, useRef, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, Calendar, ChevronDown } from 'lucide-react';
import '../../components/css/components.css';

import dashboardData from '../../data/dashboard.json';

const { pieData, barData, logs: LOGS, pieColors: PIE_COLORS } = dashboardData;

export function Dashboard() {
  const [timeRange, setTimeRange] = useState('This Month');
  const [showTimeRange, setShowTimeRange] = useState(false);
  const timeRangeRef = useRef<HTMLDivElement>(null);

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
    // Default This Month
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
    // Default This Month
    return [
      { label: 'Week 1', revenue: 63000 },
      { label: 'Week 2', revenue: 88000 },
      { label: 'Week 3', revenue: 92000 },
      { label: 'Week 4', revenue: 104000 }
    ];
  }, [timeRange]);

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

      {/* Report Logs Table */}
      <div className="base-card">
        <h3 className="pv-product-name" style={{ fontSize: '16px', marginBottom: '16px' }}>Recent Report Logs</h3>
        <div className="comp-table-container">
          <table className="comp-table">
            <thead>
              <tr>
                {['Report ID', 'Type', 'Generated', 'Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOGS.map(log => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '13px' }}>{log.id}</td>
                  <td style={{ fontWeight: 500 }}>{log.type}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{log.generated}</td>
                  <td>
                    <span className="comp-badge comp-badge-success">{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


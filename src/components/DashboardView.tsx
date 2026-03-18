import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';
import './css/components.css';

import dashboardData from '../data/dashboard.json';

const { pieData, barData, logs: LOGS, pieColors: PIE_COLORS } = dashboardData;

export function Dashboard() {
  return (
    <div>
      <div className="pv-row-sb" style={{ marginBottom: '24px' }}>
        <h2 className="pv-section-title">System Reports</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="pv-btn-outline">This Month</button>
          <button className="cv-add-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: 'auto', padding: '8px 20px' }}>
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        {/* Pie Chart */}
        <div className="base-card" style={{ flex: 1 }}>
          <h3 className="pv-product-name" style={{ fontSize: '16px', marginBottom: '4px' }}>Transaction Summary</h3>
          <p className="pv-subtext" style={{ marginBottom: '16px' }}>Live status breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {pieData.map((entry, i) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: PIE_COLORS[i], display: 'inline-block' }}></span>
                {entry.name}: <strong>{entry.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="base-card" style={{ flex: 2 }}>
          <h3 className="pv-product-name" style={{ fontSize: '16px', marginBottom: '4px' }}>Monthly Revenue</h3>
          <p className="pv-subtext" style={{ marginBottom: '16px' }}>Last 6 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip
                cursor={{ fill: 'var(--bg)', opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: '12px'
                }}
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

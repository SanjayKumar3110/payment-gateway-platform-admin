import { FileText, Download, Plus } from 'lucide-react';
import './components.css';

const MOCK_INVOICES = [
  { id: 'INV-2001', customer: 'Alice Doe', amount: 1500, status: 'Paid', date: '2026-03-10', due: '2026-03-20' },
  { id: 'INV-2002', customer: 'Bob Smith', amount: 450, status: 'Pending', date: '2026-03-10', due: '2026-03-25' },
  { id: 'INV-2003', customer: 'Charlie', amount: 12000, status: 'Overdue', date: '2026-03-01', due: '2026-03-08' },
  { id: 'INV-2004', customer: 'Dave L.', amount: 999, status: 'Paid', date: '2026-03-08', due: '2026-03-18' },
];

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid': return 'comp-badge-success';
    case 'pending': return 'comp-badge-warning';
    case 'overdue': return 'comp-badge-danger';
    default: return 'comp-badge-neutral';
  }
};

export function InvoicesView() {
  return (
    <div className="base-card">
      <div className="pv-row-sb" style={{ marginBottom: '24px' }}>
        <h2 className="pv-section-title">Invoices</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="pv-btn-outline"><Download size={14} /> Export</button>
          <button className="cv-add-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: 'auto', padding: '8px 20px' }}>
            <Plus size={14} /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="comp-stats-row">
        {[
          { label: 'Total invoices', value: '24', color: 'var(--text-primary)' },
          { label: 'Total paid', value: '18', color: '#4CAF50' },
          { label: 'Total pending', value: '4', color: '#F59E0B' },
          { label: 'Total overdue', value: '2', color: '#FF4444' },
        ].map(stat => (
          <div key={stat.label} className="comp-stat-tile">
            <div className="comp-stat-label">{stat.label}</div>
            <div className="comp-stat-value" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="comp-table-container">
        <table className="comp-table">
          <thead>
            <tr>
              {['Invoice ID', 'Customer', 'Amount', 'Issue Date', 'Due Date', 'Status', 'Actions'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_INVOICES.map(inv => (
              <tr key={inv.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>{inv.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="comp-avatar-circle">{inv.customer.charAt(0)}</div>
                    <span style={{ fontWeight: 500, fontSize: '14px' }}>{inv.customer}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>₹{inv.amount.toLocaleString()}</td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{inv.date}</td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{inv.due}</td>
                <td>
                  <span className={`comp-badge ${getStatusClass(inv.status)}`}>{inv.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[FileText, Download].map((Icon, i) => (
                      <button key={i} className="comp-icon-btn"><Icon size={14} /></button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

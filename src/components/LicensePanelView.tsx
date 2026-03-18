import { Plus, RefreshCw, XCircle, ArrowRight } from 'lucide-react';
import './css/components.css';

import MOCK_LICENSES from '../data/licenses.json';

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active': return 'comp-badge-success';
    case 'Expired': return 'comp-badge-danger';
    case 'Revoked': return 'comp-badge-neutral';
    default: return 'comp-badge-neutral';
  }
};

export function LicensePanelView() {
  return (
    <div>
      {/* Stats */}
      <div className="comp-stats-row">
        {[
          { label: 'Total Licenses', value: '4', color: 'var(--text-primary)' },
          { label: 'Active', value: '2', color: '#4CAF50' },
          { label: 'Expired', value: '1', color: '#FF4444' },
          { label: 'Revoked', value: '1', color: 'var(--text-secondary)' },
        ].map(s => (
          <div key={s.label} className="base-card" style={{ flex: 1 }}>
            <div className="comp-stat-label">{s.label}</div>
            <div className="cv-stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="base-card">
        <div className="pv-row-sb" style={{ marginBottom: '20px' }}>
          <h2 className="pv-section-title">License Administration</h2>
          <button className="cv-add-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: 'auto', padding: '8px 20px' }}>
            <Plus size={14} /> Issue License
          </button>
        </div>

        <div className="comp-table-container">
          <table className="comp-table">
            <thead>
              <tr>
                {['License Key', 'Store', 'Owner', 'Plan', 'Status', 'Device ID', 'Expires', 'Actions'].map(h => (
                  <th key={h} style={{ whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_LICENSES.map(lic => (
                <tr key={lic.key}>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>{lic.key}</td>
                  <td style={{ fontWeight: 500 }}>{lic.store}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{lic.owner}</td>
                  <td>
                    <span className="comp-badge comp-plan-badge">{lic.plan}</span>
                  </td>
                  <td>
                    <span className={`comp-badge ${getStatusClass(lic.status)}`}>{lic.status}</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>{lic.device}</td>
                  <td style={{ fontSize: '13px', color: lic.status === 'Expired' ? '#FF4444' : 'var(--text-secondary)' }}>{lic.expires}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[RefreshCw, ArrowRight, XCircle].map((Icon, i) => (
                        <button key={i} className="comp-icon-btn"><Icon size={13} /></button>
                      ))}
                    </div>
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

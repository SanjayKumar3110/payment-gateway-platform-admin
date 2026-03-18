import { Eye, FileText, Download } from 'lucide-react';

import MOCK_TRANSACTIONS from '../data/transactions.json';

const statusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success': return { backgroundColor: '#E8F5E9', color: '#4CAF50' };
    case 'pending': return { backgroundColor: '#FFF8E1', color: '#F59E0B' };
    case 'failed': return { backgroundColor: '#FFEBEE', color: '#FF4444' };
    default: return {};
  }
};

export function TransactionsTable() {
  return (
    <div className="base-card" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Transactions</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '8px 20px', borderRadius: '20px', border: '1px solid #EEEEEE',
            backgroundColor: '#FFFFFF', color: '#111111', cursor: 'pointer', fontWeight: 500, fontSize: '14px'
          }}>Export CSV</button>
          <button style={{
            padding: '8px 20px', borderRadius: '20px', border: 'none',
            backgroundColor: '#111111', color: '#FFFFFF', cursor: 'pointer', fontWeight: 500, fontSize: '14px'
          }}>+ New Entry</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #EEEEEE' }}>
              {['Transaction ID', 'Customer', 'Amount (INR)', 'Method', 'Status', 'Date', 'Staff', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#888888', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_TRANSACTIONS.map(txn => (
              <tr key={txn.id} style={{ borderBottom: '1px solid #EEEEEE' }}>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontFamily: 'monospace', color: '#888888' }}>{txn.id}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: '#F0F0F0', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 600, fontSize: '13px'
                    }}>{txn.customer.charAt(0)}</div>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{txn.customer}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '14px' }}>₹{txn.amount.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#888888' }}>{txn.method}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    ...statusStyle(txn.status), padding: '4px 10px',
                    borderRadius: '12px', fontSize: '12px', fontWeight: 600
                  }}>{txn.status}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888888' }}>{txn.date}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888888' }}>{txn.staff}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[Eye, FileText, Download].map((Icon, i) => (
                      <button key={i} style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #EEEEEE',
                        backgroundColor: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888888'
                      }}><Icon size={14} /></button>
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

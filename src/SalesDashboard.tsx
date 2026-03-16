// Simple mock dashboard
export function SalesDashboard() {
  const metrics = {
    today: 4500,
    week: 32000,
    month: 125000,
    activeLicenses: 42
  };

  return (
    <div className="license-manager" style={{ marginTop: '20px' }}>
      <h2>Sales Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        <div style={{ padding: '20px', background: '#e9ecef', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Today's Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>INR {metrics.today}</p>
        </div>
        <div style={{ padding: '20px', background: '#e9ecef', borderRadius: '8px', textAlign: 'center' }}>
          <h3>This Week</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>INR {metrics.week}</p>
        </div>
        <div style={{ padding: '20px', background: '#e9ecef', borderRadius: '8px', textAlign: 'center' }}>
          <h3>This Month</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>INR {metrics.month}</p>
        </div>
        <div style={{ padding: '20px', background: '#e9ecef', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Active Licenses</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{metrics.activeLicenses}</p>
        </div>
      </div>
    </div>
  );
}

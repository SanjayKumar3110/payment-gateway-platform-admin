import { useState } from 'react';

// Mock customer data
const mockCustomers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '9876543210', totalPurchases: 3 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '9123456780', totalPurchases: 1 },
];

export function CustomerManagement() {
  const [customers] = useState(mockCustomers);

  return (
    <div className="license-manager" style={{ marginTop: '20px' }}>
      <h2>Customer Management</h2>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Purchases</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 0' }}>{c.name}</td>
              <td style={{ padding: '8px 0' }}>{c.email}</td>
              <td style={{ padding: '8px 0' }}>{c.phone}</td>
              <td style={{ padding: '8px 0' }}>{c.totalPurchases}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

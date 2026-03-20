import { Calendar, Download, Users, DollarSign, List, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
  Bar, LineChart, Line, ComposedChart
} from 'recharts';

import DASHBOARD_DATA from '../data/dashboard.json';
import CUSTOMERS_DATA from '../data/customers.json';
import INVOICES_DATA from '../data/invoices.json';
import PAYMENTS_DATA from '../data/payments.json';
import ANALYTICS_DATA from '../data/analytics.json';

// --- Extract data mapping based on UI logic ---

// "Monthly revenue data from dashboard.json.barData"
const revenueTrendsData = DASHBOARD_DATA.barData;

// "Daily paid vs total invoices" from invoices
// The image shows dual bars / lines.
const dailyInvoicingData = INVOICES_DATA.chartData;

// Transaction Status Breakdown
// From dashboard.json pieData
const statusBreakdown = DASHBOARD_DATA.pieData; // [{name: 'Completed', value: 400}, {name: 'Processing', value: 300}, {name: 'Failed', value: 50}]
const totalTransactionsBreakdown = statusBreakdown.reduce((acc, curr) => acc + curr.value, 0);

// Summary Cards
const totalRevenue = "$152,492.00";
const totalCustomers = CUSTOMERS_DATA.length;
const totalPayments = PAYMENTS_DATA.length;
const totalProducts = ANALYTICS_DATA.products.length;

// Mini chart dummy data
const miniChartUp = [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }];
const miniChartDown = [{ v: 30 }, { v: 25 }, { v: 28 }, { v: 20 }, { v: 15 }, { v: 18 }, { v: 10 }];

export function Analytics() {
  return (
    <div style={{ padding: '24px', minHeight: '100%', backgroundColor: 'var(--bg)' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          {/* <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Welcome Back, Alex!</h1> */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>20 Mar 2026, 11:15 AM</span>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <Calendar size={12} /> Last 7 Days
            </button>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Download size={16} /> Export Data
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>

        {/* Card 1 */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Revenue</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0', lineHeight: 1.3 }}>Sum of all successful transactions from payments.json</div>
            </div>
            <div style={{ color: '#10B981', fontSize: '12px', fontWeight: 600, backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={12} /> +12.5%
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{totalRevenue}</div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChartUp}>
                  <Line type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Customers</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0', lineHeight: 1.3 }}>Count of objects in customers.json</div>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}><Users size={18} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{totalCustomers}</div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChartUp}>
                  <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Transactions</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0', lineHeight: 1.3 }}>Count of records in payments.json</div>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}><DollarSign size={18} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{totalPayments}</div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChartDown}>
                  <Line type="monotone" dataKey="v" stroke="var(--text-secondary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Products</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0', lineHeight: 1.3 }}>Count of objects in analytics.json</div>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}><List size={18} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{totalProducts}</div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChartUp}>
                  <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Revenue Trends */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Revenue Trends (Oct '25 - Mar '26)</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 24px 0' }}>Monthly revenue data from dashboard.json.barData</p>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Invoicing Activity */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Daily Invoicing Activity (Last 7 Days)</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 24px 0' }}>Daily paid vs total invoices</p>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dailyInvoicingData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="total" fill="#CBD5E1" barSize={12} radius={[2, 2, 0, 0]} />
                <Bar dataKey="paid" fill="#6366F1" barSize={12} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="paid" stroke="#475569" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

        {/* Product Performance Overview */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Product Performance Overview</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Product Info</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Price</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Sold</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Revenue Earned</th>
              </tr>
            </thead>
            <tbody>
              {ANALYTICS_DATA.products.map((prod, i) => (
                <tr key={prod.id} style={{ borderBottom: i === ANALYTICS_DATA.products.length - 1 ? 'none' : '1px solid #F3F4F6' }}>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: prod.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
                        {prod.initial}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{prod.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--text-primary)' }}>{prod.price}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: prod.status === 'Active' ? '#10B981' : '#EF4444' }}>{prod.status}</span>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--text-primary)' }}>{prod.totalSold}</td>
                  <td style={{ padding: '16px 12px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{prod.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Transaction Status Breakdown */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Transaction Status Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {statusBreakdown.map((item) => {
              const bgColors: Record<string, string> = { "Completed": "#10B981", "Processing": "var(--text-secondary)", "Failed": "#EF4444" };
              const barColor = bgColors[item.name] || '#1D4ED8';
              const percentage = ((item.value / totalTransactionsBreakdown) * 100).toFixed(1);

              return (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: barColor }}>{item.name}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{item.value} <span style={{ color: 'var(--text-secondary)' }}>| {percentage}%</span></span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: barColor, borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

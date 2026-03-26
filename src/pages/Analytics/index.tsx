import { useState, useRef, useEffect } from 'react';
import { Calendar, Download, Users, DollarSign, List, TrendingUp, ChevronDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

import InvoiceChart from '../../components/charts/InvoiceChart';

import DASHBOARD_DATA from '../../data/dashboard.json';
import PAYMENTS_DATA from '../../data/payments.json';
import ANALYTICS_DATA from '../../data/analytics.json';

// --- Extract data mapping based on UI logic ---

// "Monthly revenue data from dashboard.json.barData"
const revenueTrendsData = DASHBOARD_DATA.barData;

// Transaction Status Breakdown
// From dashboard.json pieData
const statusBreakdown = DASHBOARD_DATA.pieData; // [{name: 'Completed', value: 400}, {name: 'Processing', value: 300}, {name: 'Failed', value: 50}]
const totalTransactionsBreakdown = statusBreakdown.reduce((acc, curr) => acc + curr.value, 0);

// Dynamic summary metrics depend on `timeRange`
// (Moved into the component lifecycle)

// Mini chart dummy data
const miniChartUp = [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }];
const miniChartDown = [{ v: 30 }, { v: 25 }, { v: 28 }, { v: 20 }, { v: 15 }, { v: 18 }, { v: 10 }];

export function Analytics() {
  const [timeRange, setTimeRange] = useState('Last 7 Days');
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

  const getMetrics = () => {
    switch (timeRange) {
      case 'Last 7 Days':
        return {
          totalRevenue: "$34,250.00",
          totalCustomers: "3",
          totalPayments: Math.floor(PAYMENTS_DATA.length * 0.25),
          totalProducts: ANALYTICS_DATA.products.length,
          revenueStatus: "+4.2%",
          customersStatus: "+1",
          paymentsStatus: "+20",
          productsStatus: "0"
        };
      case 'Last Year':
        return {
          totalRevenue: "$1,842,492.00",
          totalCustomers: "145",
          totalPayments: PAYMENTS_DATA.length * 12,
          totalProducts: ANALYTICS_DATA.products.length + 4,
          revenueStatus: "+148.5%",
          customersStatus: "+45",
          paymentsStatus: "+4,521",
          productsStatus: "+4"
        };
      case 'Last Month':
      default:
        return {
          totalRevenue: "$152,492.00",
          totalCustomers: "12",
          totalPayments: PAYMENTS_DATA.length,
          totalProducts: ANALYTICS_DATA.products.length,
          revenueStatus: "+12.5%",
          customersStatus: "+3",
          paymentsStatus: "+142",
          productsStatus: "0"
        };
    }
  };

  const currentMetrics = getMetrics();

  return (
    <div style={{ padding: '24px', minHeight: '100%', backgroundColor: 'var(--bg)' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          {/* <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Welcome Back, Alex!</h1> */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>20 Mar 2026, 11:15 AM</span>
            
            <div style={{ position: 'relative' }} ref={timeRangeRef}>
              <button 
                className="glass-action-btn small" 
                onClick={() => setShowTimeRange(!showTimeRange)}
                style={{ minWidth: '130px', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> {timeRange}
                </div>
                <ChevronDown size={14} />
              </button>

              {showTimeRange && (
                <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '130px', borderRadius: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {['Last 7 Days', 'Last Month', 'Last Year'].map(opt => (
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
          </div>
        </div>
        <button className="cv-add-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: 'auto', padding: '8px 20px' }}>
          <Download size={14} /> Export Data
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="responsive-grid-4" style={{ marginBottom: '20px' }}>

        {/* Card 1 */}
        <div className="comp-stat-tile" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Revenue</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0', lineHeight: 1.3 }}>Sum of all successful transactions from payments.json</div>
            </div>
            <div style={{ color: '#10B981', fontSize: '12px', fontWeight: 600, backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={12} /> {currentMetrics.revenueStatus}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentMetrics.totalRevenue}</div>
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
        <div className="comp-stat-tile" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Customers</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0', lineHeight: 1.3 }}>Count of objects in customers.json</div>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}><Users size={18} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentMetrics.totalCustomers}</div>
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
        <div className="comp-stat-tile" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Transactions</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0', lineHeight: 1.3 }}>Count of records in payments.json</div>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}><DollarSign size={18} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentMetrics.totalPayments}</div>
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
        <div className="comp-stat-tile" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Products</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0', lineHeight: 1.3 }}>Count of objects in analytics.json</div>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}><List size={18} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentMetrics.totalProducts}</div>
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
      <div className="responsive-grid-2-1" style={{ marginBottom: '20px' }}>

        {/* Revenue Trends */}
        <div className="base-card">
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
                <Tooltip 
                  cursor={false} 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)', 
                    boxShadow: 'var(--glass-shadow)',
                    backgroundColor: 'var(--tooltip-bg)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }} 
                  labelStyle={{ color: 'var(--tooltip-text)', fontWeight: 600, marginBottom: '4px' }}
                  itemStyle={{ color: 'var(--tooltip-text-sec)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Invoicing Activity */}
        <div className="base-card" style={{ flex: '2', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Invoice Income</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Listed below are all conclusion from invoice income</p>
            </div>
          </div>

          <InvoiceChart />
        </div>
      </div>

      {/* PRODUCTS AND ACTIVITY */}
      <div className="responsive-grid-2-1">

        {/* Top Products */}
        <div className="base-card">
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
        <div className="base-card">
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


import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, TrendingUp, ChevronDown, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

import InvoiceChart from './utils/InvoiceUtils';
import DASHBOARD_DATA from '@data/dashboard.json';
import PAYMENTS_DATA from '@data/payments.json';
import ANALYTICS_DATA from '@data/analytics.json';

const fallbackRevenueTrends = DASHBOARD_DATA.barData.map(d => ({ timeLabel: d.month, revenue: d.revenue }));
const fallbackStatusBreakdown = DASHBOARD_DATA.pieData;

// --- 1. THEME & CONSTANTS ---
const THEME_COLORS = {
  primary: '#6366F1', success: '#10B981', warning: '#F59E0B',
  danger: '#F43F5E', info: '#3B82F6', muted: '#94A3B8',
};

const STATUS_COLOR_MAP: Record<string, string> = {
  'Completed': THEME_COLORS.success, 'Succeeded': THEME_COLORS.success,
  'Processing': THEME_COLORS.warning, 'Failed': THEME_COLORS.danger,
  'Active': THEME_COLORS.success, 'Inactive': THEME_COLORS.danger,
};

// --- 2. PARSERS ---
const parseAmount = (val: any) => {
  if (typeof val === 'number') return val;
  return parseFloat(val.replace(/[^0-9.-]+/g, '')) || 0;
};

const parseDate = (dateStr: string): Date => {
  try {
    // Cleans "Mar 22, 2026, 20:17 PM" to "Mar 22, 2026 20:17"
    const cleaned = dateStr.replace(/, (\d{2}:\d{2}) [APM]{2}/, '$1');
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? new Date(0) : d;
  } catch {
    return new Date(0);
  }
};

export function Analytics() {
  const [timeRange, setTimeRange] = useState('Last Week');
  const [showTimeRange, setShowTimeRange] = useState(false);
  const [realPayments, setRealPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const timeRangeRef = useRef<HTMLDivElement>(null);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments`);
      if (response.ok) {
        const data = await response.json();
        setRealPayments(data);
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- 3. DATA LOGIC (FIXED DATE ISSUE) ---

  const currentMetrics = useMemo(() => {
    const allPayments = [...realPayments, ...PAYMENTS_DATA];

    // FIX: Instead of using 'new Date()', find the latest date in your JSON 
    // so that the "Last 7 Days" logic actually finds your 2026 data.
    const latestDateInData = new Date(Math.max(...allPayments.map(p => parseDate(p.date).getTime())));
    const referenceDate = latestDateInData;

    const getWindow = (range: string) => {
      const end = referenceDate.getTime();
      let start = new Date(referenceDate);

      if (range === 'Last Week') start.setDate(start.getDate() - 7);
      else if (range === 'Last Month') start.setMonth(start.getMonth() - 1);
      else if (range === 'Last Year') start.setFullYear(start.getFullYear() - 1);

      return { start: start.getTime(), end };
    };

    const getPrevWindow = (range: string) => {
      const current = getWindow(range);
      const duration = current.end - current.start;
      return { start: current.start - duration, end: current.start };
    };

    const currentWin = getWindow(timeRange);
    const prevWin = getPrevWindow(timeRange);

    // Filtering
    const currentPeriod = allPayments.filter(p => {
      const t = parseDate(p.date).getTime();
      return t >= currentWin.start && t <= currentWin.end;
    });

    const prevPeriod = allPayments.filter(p => {
      const t = parseDate(p.date).getTime();
      return t >= prevWin.start && t <= prevWin.end;
    });

    // Calculations
    const currentRev = currentPeriod.filter(p => p.status === 'Succeeded' || p.status === 'Completed').reduce((acc, p) => acc + parseAmount(p.amount), 0);
    const prevRev = prevPeriod.filter(p => p.status === 'Succeeded' || p.status === 'Completed').reduce((acc, p) => acc + parseAmount(p.amount), 0);

    const currentCount = currentPeriod.length;
    const prevCount = prevPeriod.length;

    const currentCust = new Set(currentPeriod.map(p => p.customerId || p.id)).size;
    const prevCust = new Set(prevPeriod.map(p => p.customerId || p.id)).size;

    const calcGrowth = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? '+100%' : '0%';
      const diff = ((curr - prev) / prev) * 100;
      return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    };

    // Dynamic Chart Data
    const revenueByTime: Record<string, number> = {};
    currentPeriod.forEach(p => {
      if (p.status === 'Succeeded' || p.status === 'Completed') {
        const d = parseDate(p.date);
        const key = timeRange === 'Last Year'
          ? d.toLocaleString('default', { month: 'short' })
          : d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        revenueByTime[key] = (revenueByTime[key] || 0) + parseAmount(p.amount);
      }
    });

    const sortedKeys = Object.keys(revenueByTime).sort((a, b) => {
      if (timeRange === 'Last Year') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a) - months.indexOf(b);
      }
      return new Date(`${a}, 2026`).getTime() - new Date(`${b}, 2026`).getTime();
    });

    const dynamicRevenueTrends = sortedKeys.map(k => ({
      timeLabel: k,
      revenue: revenueByTime[k]
    }));

    const statusCounts: Record<string, number> = {};
    currentPeriod.forEach(p => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    const dynamicStatusBreakdown = Object.keys(statusCounts).map(k => ({
      name: k,
      value: statusCounts[k]
    }));

    const ratio = currentPeriod.length / (allPayments.length || 1);
    const dynamicProducts = (ANALYTICS_DATA as any).products.map((prod: any) => {
      const sold = Math.max(1, Math.floor(prod.totalSold * ratio));
      const rev = parseAmount(prod.revenue) * ratio;
      return {
        ...prod,
        totalSold: sold,
        revenue: rev.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      };
    });

    const miniChartData = dynamicRevenueTrends.length
      ? dynamicRevenueTrends.map(d => ({ v: d.revenue }))
      : [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }];

    return {
      totalRevenue: currentRev.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      totalCustomers: currentCust.toString(),
      totalPayments: currentCount.toString(),
      totalProducts: dynamicProducts.length.toString(),
      revenueStatus: calcGrowth(currentRev, prevRev),
      customersStatus: calcGrowth(currentCust, prevCust),
      paymentsStatus: calcGrowth(currentCount, prevCount),
      productsStatus: calcGrowth(dynamicProducts.length, (ANALYTICS_DATA as any).products.length),
      revenueTrendsData: dynamicRevenueTrends.length ? dynamicRevenueTrends : fallbackRevenueTrends,
      statusBreakdown: dynamicStatusBreakdown.length ? dynamicStatusBreakdown : fallbackStatusBreakdown,
      products: dynamicProducts,
      miniChartData
    };
  }, [timeRange, realPayments]);

  // --- 4. UI HELPERS ---
  const getStatusColor = (statusStr: string) => {
    const isPositive = statusStr.startsWith('+');
    return {
      color: isPositive ? THEME_COLORS.success : THEME_COLORS.danger,
      bg: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
      icon: isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />
    };
  };

  return (
    <div style={{ padding: '24px', minHeight: '100%', backgroundColor: 'var(--bg)' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString()}</span>
          <div style={{ position: 'relative' }} ref={timeRangeRef}>
            <button className="glass-action-btn small" onClick={() => setShowTimeRange(!showTimeRange)} style={{ minWidth: '130px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {timeRange}</div>
              <ChevronDown size={14} />
            </button>
            {showTimeRange && (
              <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '130px', borderRadius: '8px', zIndex: 100 }}>
                {['Last Week', 'Last Month', 'Last Year'].map(opt => (
                  <button key={opt} onClick={() => { setTimeRange(opt); setShowTimeRange(false); }} style={{ width: '100%', padding: '8px 16px', textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>{opt}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="responsive-grid-4" style={{ marginBottom: '20px' }}>

        {/* Card 1 - Revenue */}
        <div className="comp-stat-tile" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Revenue</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0' }}>Successful transactions</div>
            </div>
            {(() => {
              const { color, bg, icon } = getStatusColor(currentMetrics.revenueStatus);
              return (
                <div style={{ color, backgroundColor: bg, fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {icon} {currentMetrics.revenueStatus}
                </div>
              );
            })()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : currentMetrics.totalRevenue}</div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentMetrics.miniChartData}>
                  <Line type="monotone" dataKey="v" stroke={THEME_COLORS.primary} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2 - Customers */}
        <div className="comp-stat-tile" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Customers</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0' }}>Unique customers</div>
            </div>
            {(() => {
              const { color, bg, icon } = getStatusColor(currentMetrics.customersStatus);
              return (
                <div style={{ color, backgroundColor: bg, fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {icon} {currentMetrics.customersStatus}
                </div>
              );
            })()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : currentMetrics.totalCustomers}</div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentMetrics.miniChartData}>
                  <Line type="monotone" dataKey="v" stroke={THEME_COLORS.success} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3 - Transactions */}
        <div className="comp-stat-tile" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Transactions</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0' }}>Total count</div>
            </div>
            {(() => {
              const { color, bg, icon } = getStatusColor(currentMetrics.paymentsStatus);
              return (
                <div style={{ color, backgroundColor: bg, fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {icon} {currentMetrics.paymentsStatus}
                </div>
              );
            })()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : currentMetrics.totalPayments}</div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentMetrics.miniChartData}>
                  <Line type="monotone" dataKey="v" stroke={THEME_COLORS.muted} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 4 - Products */}
        <div className="comp-stat-tile" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Products</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 16px 0' }}>Active catalog</div>
            </div>
            {(() => {
              const { color, bg, icon } = getStatusColor(currentMetrics.productsStatus);
              return (
                <div style={{ color, backgroundColor: bg, fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {icon} {currentMetrics.productsStatus}
                </div>
              );
            })()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{isLoading ? '...' : currentMetrics.totalProducts}</div>
            <div style={{ width: '60px', height: '30px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentMetrics.miniChartData}>
                  <Line type="monotone" dataKey="v" stroke={THEME_COLORS.info} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="responsive-grid-2-1" style={{ marginBottom: '20px' }}>
        <div className="base-card">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Revenue Trends</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 24px 0' }}>Monthly revenue data</p>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentMetrics.revenueTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THEME_COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={THEME_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="timeLabel" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke={THEME_COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="base-card" style={{ flex: '2', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Invoice Income</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Detailed conclusion from invoice income</p>
          <InvoiceChart />
        </div>
      </div>

      {/* PRODUCTS AND ACTIVITY */}
      <div className="responsive-grid-2-1">
        <div className="base-card">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Product Performance Overview</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Product Info</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Price</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Sold</th>
                <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Revenue Earned</th>
              </tr>
            </thead>
            <tbody>
              {currentMetrics.products.map((prod: any, i: number) => (
                <tr key={prod.id} style={{ borderBottom: i === currentMetrics.products.length - 1 ? 'none' : '1px solid var(--border)' }}>
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
                    {/* UPDATED: Using the Status Color Map */}
                    <span style={{ fontSize: '13px', fontWeight: 500, color: STATUS_COLOR_MAP[prod.status] || THEME_COLORS.muted }}>{prod.status}</span>
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
            {currentMetrics.statusBreakdown.map((item: any) => {
              // UPDATED: Using the Status Color Map
              const barColor = STATUS_COLOR_MAP[item.name] || THEME_COLORS.info;
              const totalBreakdown = currentMetrics.statusBreakdown.reduce((acc: number, curr: any) => acc + curr.value, 0);
              const percentage = ((item.value / (totalBreakdown || 1)) * 100).toFixed(1);

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
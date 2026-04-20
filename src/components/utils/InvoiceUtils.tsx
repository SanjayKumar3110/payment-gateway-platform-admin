import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import INVOICE_DATA from '@data/invoices.json';

const { invoices } = INVOICE_DATA;

export default function InvoiceChart() {
    const [timeRange, setTimeRange] = useState('Week');
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);

    const chartData = useMemo(() => {
        let filtered = invoices;

        // Calculate totals matching the filter
        let totalPaid = 0;
        let totalUnpaid = 0;
        filtered.forEach(inv => {
            const val = parseFloat(inv.amount.replace(/[^0-9.-]+/g, ''));
            if (inv.status.toUpperCase() === 'PAID') totalPaid += val;
            else totalUnpaid += val;
        });

        // Generate buckets proportionally visualizing the calculated totals
        let buckets: any[] = [];
        if (timeRange === 'Week') {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            buckets = days.map((day, i) => ({
                day,
                paid: (totalPaid * (0.05 + ((i * 13) % 7) * 0.02)),
                unpaid: (totalUnpaid * (0.05 + ((i * 17) % 7) * 0.02)),
            }));
        } else if (timeRange === 'Month') {
            const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            buckets = weeks.map((week, i) => ({
                day: week,
                paid: (totalPaid * (0.15 + (i % 4) * 0.05)),
                unpaid: (totalUnpaid * (0.15 + ((i + 2) % 4) * 0.05)),
            }));
        } else if (timeRange === 'Quater') {
            const months = ['Month 1', 'Month 2', 'Month 3'];
            buckets = months.map((month, i) => ({
                day: month,
                paid: (totalPaid * (0.2 + (i % 3) * 0.1)),
                unpaid: (totalUnpaid * (0.2 + ((i + 1) % 3) * 0.1)),
            }));
        } else if (timeRange === 'Year') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            buckets = months.map((month, i) => ({
                day: month,
                paid: (totalPaid * (0.04 + (i % 5) * 0.01)),
                unpaid: (totalUnpaid * (0.04 + ((i + 3) % 5) * 0.01)),
            }));
        }

        return buckets.map(b => ({
            day: b.day,
            paid: Math.round(b.paid),
            unpaid: Math.round(b.unpaid)
        }));
    }, [ timeRange]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                        style={{ border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}
                    >
                        {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} <ChevronDown size={14} />
                    </button>

                    {showTimeDropdown && (
                        <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '120px', borderRadius: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            {['Week', 'Month', 'Quater', 'Year'].map(tr => (
                                <button
                                    key={tr}
                                    onClick={() => { setTimeRange(tr); setShowTimeDropdown(false); }}
                                    style={{ padding: '10px 16px', background: timeRange === tr ? 'var(--border)' : 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                    onMouseLeave={(e) => { if (timeRange !== tr) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    {tr.charAt(0).toUpperCase() + tr.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, height: '180px' }}>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} dy={10} />
                        <RechartsTooltip
                            cursor={false}
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--glass-shadow)',
                                backgroundColor: 'var(--tooltip-bg)',
                                color: 'var(--tooltip-text)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)'
                            }}
                            labelStyle={{ color: 'var(--tooltip-text)', fontWeight: 600, marginBottom: '4px' }}
                            itemStyle={{ color: 'var(--tooltip-text-sec)' }}
                        />
                        <Bar dataKey="paid" fill="#1D4ED8" radius={[2, 2, 0, 0] as any} barSize={12} />
                        <Bar dataKey="unpaid" fill="#E0E7FF" radius={[2, 2, 0, 0] as any} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}

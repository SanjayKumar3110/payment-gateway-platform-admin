import { useState } from 'react';
import { Calendar, Filter, ChevronDown, ArrowRight, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import INVOICE_DATA from '../data/invoices.json';
import './css/components.css';

const { chartData, overview, invoices, selectedInvoice } = INVOICE_DATA;

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'PAID') {
    return (
      <span style={{ padding: '4px 12px', backgroundColor: '#ECFDF5', color: '#10B981', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
        PAID
      </span>
    );
  }
  return (
    <span style={{ padding: '4px 12px', backgroundColor: '#FEF2F2', color: '#EF4444', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
      UNPAID
    </span>
  );
};

export function Invoices() {
  const [chartFilter, setChartFilter] = useState('All');

  return (
    <div style={{ display: 'flex', gap: '20px', minHeight: '100%', padding: '24px', backgroundColor: 'var(--bg)' }}>

      {/* LEFT COLUMN (Main Content) */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

        {/* Top Blocks Wrapper */}
        <div style={{ display: 'flex', gap: '20px' }}>

          {/* Invoice Income Card */}
          <div className="base-card" style={{ flex: '2', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Invoice Income</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Listed below are all conclusion from invoice income</p>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                <Calendar size={14} /> Export Invoice
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', backgroundColor: 'var(--border)', borderRadius: '8px', padding: '4px' }}>
                {['All', 'Single', 'Recurring'].map(filter => (
                  <button key={filter} onClick={() => setChartFilter(filter)} style={{
                    padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                    backgroundColor: chartFilter === filter ? '#1D4ED8' : 'transparent',
                    color: chartFilter === filter ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}>
                    {filter}
                  </button>
                ))}
              </div>
              <button style={{ border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>
                Last Week <ChevronDown size={14} />
              </button>
            </div>

            <div style={{ flex: 1, minHeight: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} dy={10} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="paid" fill="#1D4ED8" radius={[2, 2, 0, 0] as any} barSize={24} background={{ fill: '#E0E7FF', radius: [2, 2, 0, 0] as any }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Overview Card */}
          <div className="base-card" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px 0' }}>Overview</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Paid :</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{overview.totalPaid}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Issued :</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{overview.totalIssued}</span>
            </div>

            <div style={{ position: 'relative', height: '36px', width: '100%', backgroundColor: '#E0E7FF', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '80%', backgroundColor: '#1D4ED8' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'auto' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Paid</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Issued</span>
            </div>

            <button style={{ border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1D4ED8', fontWeight: 600, padding: '0', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '24px' }}>
              View Detail <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Billing & invoices Card */}
        <div className="base-card" style={{ flex: '1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Billing & invoices</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Listed below are all of your invoices and bills</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                <Calendar size={14} /> Select Date
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid #E5E7EB', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                <Filter size={14} /> Apply Filter
              </button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Invoice ID</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Invoice Name</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Start Date</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>End Date</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Invoice amount</th>
                <th style={{ padding: '12px 0', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={idx} style={{ borderBottom: idx === invoices.length - 1 ? 'none' : '1px solid #F3F4F6', transition: 'background-color 0.15s ease' }}>
                  <td style={{ padding: '16px 0', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>{inv.id}</td>
                  <td style={{ padding: '16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: inv.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '14px' }}>
                        {inv.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{inv.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>{inv.startDate}</td>
                  <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>{inv.endDate}</td>
                  <td style={{ padding: '16px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>{inv.amount}</td>
                  <td style={{ padding: '16px 0' }}>
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN (Invoice Details Panel) */}
      <div className="base-card" style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column' }}>

        {/* Header Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#1D4ED8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '24px' }}>❋</span>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Invoice</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selectedInvoice.id}</span>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Start date : {selectedInvoice.startDate}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>End date : {selectedInvoice.endDate}</span>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '20px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{selectedInvoice.clientName}</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{selectedInvoice.clientAddress}</p>
        </div>

        {/* Item Details */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Item Details</h4>

          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Bill Name</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedInvoice.billName}</span>
            </div>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Type</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedInvoice.type}</span>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Amount</span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedInvoice.amount}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Note</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
            {selectedInvoice.note}
          </p>
        </div>

        {/* File */}
        <div style={{ marginTop: 'auto' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>File</h4>
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', backgroundColor: '#1D4ED8', border: 'none', borderRadius: '8px',
            color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'background-color 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E40AF'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}>
            <Download size={16} /> Download PDF
          </button>
        </div>

      </div>

    </div>
  );
}

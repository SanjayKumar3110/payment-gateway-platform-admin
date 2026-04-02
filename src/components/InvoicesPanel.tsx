import { useState, useRef, useEffect } from 'react';
import { Calendar, Filter, ChevronDown, Download, ChevronLeft, ChevronRight } from 'lucide-react';
// import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import INVOICE_DATA from '@data/invoices.json';
import './css/components.css';
import InvoiceChart from './utils/InvoiceUtils';

const { invoices } = INVOICE_DATA;

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'PAID') {
    return (
      <span style={{ padding: '4px 12px', color: '#10B981', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
        PAID
      </span>
    );
  }
  return (
    <span style={{ padding: '4px 12px', color: '#EF4444', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
      UNPAID
    </span>
  );
};

const CalendarDropdown = ({ onSelect, onClose }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); };
  const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); };

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', padding: '16px', borderRadius: '12px', width: '260px', zIndex: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', alignItems: 'center' }}>
        <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ChevronLeft size={16} onClick={handlePrev} style={{ cursor: 'pointer' }} />
          <ChevronRight size={16} onClick={handleNext} style={{ cursor: 'pointer' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
        {days.map(d => <div key={d} style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {blanks.map(b => <div key={`b-${b}`} />)}
        {dates.map(date => {
          const dd = date < 10 ? '0' + date : date;
          const mm = (currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
          const yyyy = currentDate.getFullYear();
          const dateStr = `${dd}/${mm}/${yyyy}`;
          return (
            <div
              key={date}
              onClick={() => { onSelect(dateStr); onClose(); }}
              style={{
                padding: '6px 0', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {date}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export function Invoices() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0]);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [activeDateFilter, setActiveDateFilter] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('');

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) setShowFilterMenu(false);
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) setShowDatePicker(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  let filteredInvoices = invoices.filter(inv => {
    let statusMatch = true;
    let typeMatch = true;

    if (activeStatusFilter) {
      statusMatch = inv.status.toUpperCase() === activeStatusFilter.toUpperCase();
    }

    if (activeTypeFilter) {
      typeMatch = inv.type.replace(/\s|-/g, '').toLowerCase() === activeTypeFilter.replace(/\s|-/g, '').toLowerCase();
    }

    return statusMatch && typeMatch;
  });

  if (activeDateFilter) {
    const getParts = (dStr: string) => {
      const [d, m, y] = dStr.split('/');
      return { d, m, y };
    };
    const { m: selM, y: selY } = getParts(activeDateFilter);

    const matchStartFull = filteredInvoices.filter(inv => inv.startDate === activeDateFilter);
    const matchEndFull = filteredInvoices.filter(inv => inv.endDate === activeDateFilter);
    const matchStartMonth = filteredInvoices.filter(inv => getParts(inv.startDate).m === selM && getParts(inv.startDate).y === selY);
    const matchEndMonth = filteredInvoices.filter(inv => getParts(inv.endDate).m === selM && getParts(inv.endDate).y === selY);
    const matchStartYear = filteredInvoices.filter(inv => getParts(inv.startDate).y === selY);
    const matchEndYear = filteredInvoices.filter(inv => getParts(inv.endDate).y === selY);

    if (matchStartFull.length > 0) {
      filteredInvoices = matchStartFull;
    } else if (matchEndFull.length > 0) {
      filteredInvoices = matchEndFull;
    } else if (matchStartMonth.length > 0) {
      filteredInvoices = matchStartMonth;
    } else if (matchEndMonth.length > 0) {
      filteredInvoices = matchEndMonth;
    } else if (matchStartYear.length > 0) {
      filteredInvoices = matchStartYear;
    } else if (matchEndYear.length > 0) {
      filteredInvoices = matchEndYear;
    } else {
      filteredInvoices = [];
    }
  }

  const getFilterText = () => {
    let count = 0;
    if (activeStatusFilter) count++;
    if (activeTypeFilter) count++;
    if (count === 0) return 'Filter';
    if (count === 1) return activeStatusFilter || activeTypeFilter;
    return `${count} Filters`;
  };

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                <Download size={14} /> Export Invoice
              </button>
            </div>

            <InvoiceChart />
          </div>
        </div>

        {/* Billing & invoices Card */}
        <div className="base-card" style={{ flex: '1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 50 }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Billing & invoices</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Listed below are all of your invoices and bills</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative' }} ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: activeDateFilter ? '#1D4ED8' : 'var(--surface)', border: activeDateFilter ? '1px solid #1D4ED8' : '1px solid var(--border)', borderRadius: '8px', color: activeDateFilter ? 'white' : 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <Calendar size={14} /> {activeDateFilter ? activeDateFilter : 'Select Date'}
                </button>
                {showDatePicker && <CalendarDropdown onSelect={(d: string) => { setActiveDateFilter(d); setCurrentPage(1); setShowDatePicker(false); }} onClose={() => setShowDatePicker(false)} />}
              </div>

              <div style={{ position: 'relative' }} ref={filterMenuRef}>
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: (activeStatusFilter || activeTypeFilter) ? '#1D4ED8' : 'var(--surface)', border: (activeStatusFilter || activeTypeFilter) ? '1px solid #1D4ED8' : '1px solid var(--border)', borderRadius: '8px', color: (activeStatusFilter || activeTypeFilter) ? 'white' : 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <Filter size={14} /> {getFilterText()} <ChevronDown size={14} />
                </button>

                {showFilterMenu && (
                  <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '220px', borderRadius: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {(activeDateFilter || activeStatusFilter || activeTypeFilter) && (
                      <button
                        onClick={() => { setActiveDateFilter(''); setActiveStatusFilter(''); setActiveTypeFilter(''); setCurrentPage(1); setShowFilterMenu(false); setShowDatePicker(false); }}
                        style={{ padding: '12px 16px', background: 'var(--surface)', border: 'none', textAlign: 'left', color: '#EF4444', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
                      >
                        Clear All Filters
                      </button>
                    )}

                    <div style={{ padding: '12px 16px 4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                    {['Paid', 'Unpaid'].map(opt => (
                      <button
                        key={opt}
                        onClick={(e) => { e.stopPropagation(); setActiveStatusFilter(activeStatusFilter === opt ? '' : opt); setCurrentPage(1); }}
                        style={{ padding: '8px 16px', background: activeStatusFilter.toUpperCase() === opt.toUpperCase() ? 'var(--border)' : 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                        onMouseLeave={(e) => {
                          if (activeStatusFilter.toUpperCase() !== opt.toUpperCase()) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {opt}
                      </button>
                    ))}

                    <div style={{ padding: '12px 16px 4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderTop: '1px solid var(--border)', marginTop: '4px' }}>Type</div>
                    {['One-Time', 'Recurring', 'Quarterly', 'Installment', 'Subscription'].map(opt => (
                      <button
                        key={opt}
                        onClick={(e) => { e.stopPropagation(); setActiveTypeFilter(activeTypeFilter === opt ? '' : opt); setCurrentPage(1); }}
                        style={{ padding: '8px 16px', background: activeTypeFilter.replace(/\s|-/g, '').toLowerCase() === opt.replace(/\s|-/g, '').toLowerCase() ? 'var(--border)' : 'transparent', border: 'none', textAlign: 'left', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                        onMouseLeave={(e) => {
                          if (activeTypeFilter.replace(/\s|-/g, '').toLowerCase() !== opt.replace(/\s|-/g, '').toLowerCase()) e.currentTarget.style.backgroundColor = 'transparent';
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

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
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
              {paginatedInvoices.map((inv, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedInvoice(inv)}
                  style={{
                    borderBottom: idx === paginatedInvoices.length - 1 ? 'none' : '1px solid var(--border)',
                    backgroundColor: selectedInvoice.id === inv.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { if (selectedInvoice.id !== inv.id) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)' }}
                  onMouseLeave={(e) => { if (selectedInvoice.id !== inv.id) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '16px 0', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Showing {paginatedInvoices.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: (currentPage === totalPages || totalPages === 0) ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1, cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
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

        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{selectedInvoice.name}</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{selectedInvoice.clientAddress}</p>
        </div>

        {/* Item Details */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Item Details</h4>

          <div className="invoice-item-grid">
            <div className="invoice-item-row">
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Bill Name</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedInvoice.billName}</span>
            </div>
            <div className="invoice-item-row">
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Type</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedInvoice.type}</span>
            </div>
            <div className="invoice-item-row">
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

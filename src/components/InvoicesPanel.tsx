import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { Calendar, Filter, ChevronDown, Download, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import INVOICE_DATA from '@data/invoices.json';
import './css/components.css';
import { SingleInvoiceDoc, BulkInvoiceDoc } from './utils/InvoicePDF';
import { registerDownload } from './utils/DownloadUtil';

const { invoices } = INVOICE_DATA;

const StatusBadge = ({ status }: { status: string }) => {
  const isPaid = status === 'PAID';
  return (
    <span style={{
      padding: '4px 12px',
      color: isPaid ? '#10B981' : '#EF4444',
      backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isPaid ? '#10B981' : '#EF4444' }}></div>
      {status}
    </span>
  );
};

// Enhanced Calendar for Range Selection with Presets
const CalendarDropdown = ({ onSelectRange, rangeStart, rangeEnd }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); };
  const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); };

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const formatDate = (date: Date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${d < 10 ? '0' + d : d}/${m < 10 ? '0' + m : m}/${y}`;
  };

  const parseToDate = (s: string) => {
    if (!s) return null;
    const [d, m, y] = s.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

  const applyPreset = (preset: string) => {
    const today = new Date();
    let start, end;

    switch (preset) {
      case 'today':
        start = end = today;
        break;
      case '7days':
        end = today;
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      case '30days':
        end = today;
        start = new Date(today);
        start.setDate(today.getDate() - 30);
        break;
      case 'thisMonth':
        end = today;
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default: return;
    }

    onSelectRange('CLEAR');
    onSelectRange(formatDate(start));
    onSelectRange(formatDate(end));
  };

  const isSelected = (d: number) => {
    const dateStr = `${d < 10 ? '0' + d : d}/${(currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`;
    return dateStr === rangeStart || dateStr === rangeEnd;
  };

  const isInRange = (d: number) => {
    if (!rangeStart || !rangeEnd) return false;
    const current = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    const start = parseToDate(rangeStart)!;
    const end = parseToDate(rangeEnd)!;
    return current > start && current < end;
  };

  const getStatusText = () => {
    if (!rangeStart) return "Select Start Date";
    if (rangeStart && !rangeEnd) return "Select End Date";
    return "Range Selected";
  };

  return (
    <div className="solid-dropdown" style={{
      position: 'absolute', top: '100%', left: 0, marginTop: '8px',
      borderRadius: '16px', width: '420px', zIndex: 100,
      display: 'flex', overflow: 'hidden'
    }}>
      {/* Sidebar Presets */}
      <div style={{ width: '140px', background: 'rgba(0,0,0,0.02)', borderRight: '1px solid var(--border)', padding: '12px' }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Presets</div>
        {[
          { id: 'today', label: 'Today' },
          { id: '7days', label: 'Last 7 Days' },
          { id: '30days', label: 'Last 30 Days' },
          { id: 'thisMonth', label: 'This Month' },
          { id: 'lastMonth', label: 'Last Month' },
        ].map(p => (
          <button
            key={p.id}
            onClick={(e) => { e.stopPropagation(); applyPreset(p.id); }}
            style={{ width: '100%', textAlign: 'left', padding: '8px 10px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Calendar Area */}
      <div style={{ flex: 1, padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4F46E5', marginBottom: '4px' }}>{getStatusText()}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={handlePrev}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' }}
              ><ChevronLeft size={16} /></button>
              <button
                onClick={handleNext}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-secondary)' }}
              ><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
          {days.map(d => <div key={d} style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
          {blanks.map(b => <div key={`b-${b}`} />)}
          {dates.map(date => {
            const active = isSelected(date);
            const inRange = isInRange(date);
            const dd = date < 10 ? '0' : '';
            const mmNum = currentDate.getMonth() + 1;
            const mm = mmNum < 10 ? '0' : '';
            const dateStr = `${dd}${date}/${mm}${mmNum}/${currentDate.getFullYear()}`;

            return (
              <div
                key={date}
                onClick={() => onSelectRange(dateStr)}
                style={{
                  padding: '6px 0',
                  fontSize: '12px',
                  color: active ? 'white' : 'var(--text-primary)',
                  backgroundColor: active ? '#4F46E5' : inRange ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.1s',
                  textAlign: 'center',
                  fontWeight: active ? 700 : 500
                }}
              >
                {date}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onSelectRange('CLEAR'); }}
            style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 600 }}
          >Reset</button>
          <button
            onClick={(e) => { e.stopPropagation(); onSelectRange('CLOSE'); }}
            style={{ flex: 1, padding: '8px', border: 'none', background: '#4F46E5', color: 'white', fontSize: '12px', cursor: 'pointer', borderRadius: '8px', fontWeight: 600 }}
          >Apply</button>
        </div>
      </div>
    </div>
  );
};

export const Invoices = memo(function Invoices() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0]);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState('');
  const [activeMethodFilter, setActiveMethodFilter] = useState('');

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

  const handleDateSelect = (dateStr: string) => {
    if (dateStr === 'CLEAR') {
      setRangeStart('');
      setRangeEnd('');
      return;
    }
    if (dateStr === 'CLOSE') {
      setShowDatePicker(false);
      return;
    }
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dateStr);
      setRangeEnd('');
    } else {
      const parse = (s: string) => {
        const [d, m, y] = s.split('/').map(Number);
        return new Date(y, m - 1, d);
      };
      const d1 = parse(rangeStart);
      const d2 = parse(dateStr);
      if (d2 < d1) {
        setRangeEnd(rangeStart);
        setRangeStart(dateStr);
      } else {
        setRangeEnd(dateStr);
      }
      setShowDatePicker(false);
    }
    setCurrentPage(1);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      let match = true;
      if (activeStatusFilter) match = match && inv.status.toUpperCase() === activeStatusFilter.toUpperCase();
      if (activeMethodFilter) {
        const invMethod = (inv as any).method || 'Credit Card';
        match = match && invMethod.toLowerCase() === activeMethodFilter.toLowerCase();
      }

      const parse = (s: string) => {
        const [d, m, y] = s.split('/').map(Number);
        return new Date(y, m - 1, d);
      };

      if (rangeStart && rangeEnd) {
        const invDate = parse(inv.startDate);
        const start = parse(rangeStart);
        const end = parse(rangeEnd);
        match = match && invDate >= start && invDate <= end;
      } else if (rangeStart) {
        match = match && inv.startDate === rangeStart;
      }

      return match;
    });
  }, [activeStatusFilter, activeMethodFilter, rangeStart, rangeEnd]);

  useEffect(() => {
    if (filteredInvoices.length > 0 && !filteredInvoices.find(i => i.id === selectedInvoice?.id)) {
      setSelectedInvoice(filteredInvoices[0]);
    }
  }, [filteredInvoices]);

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async (blob: Blob, filename: string) => {
    try {
      // In Electron with nodeIntegration, we send data to main process to show Save Dialog
      const arrayBuffer = await blob.arrayBuffer();
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('save-pdf', { buffer: arrayBuffer, filename });
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback for browser testing
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    registerDownload(filename);
  };

  const handleDownloadSingle = async (invoice: any) => {
    if (!invoice || isDownloading) return;
    setIsDownloading(true);
    try {
      const doc = <SingleInvoiceDoc invoice={invoice} />;
      const blob = await pdf(doc).toBlob();
      await downloadFile(blob, `Invoice-${invoice.id}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportBulk = async () => {
    if (filteredInvoices.length === 0 || isDownloading) return;
    setIsDownloading(true);
    try {
      const doc = <BulkInvoiceDoc invoices={filteredInvoices} />;
      const blob = await pdf(doc).toBlob();
      await downloadFile(blob, `Invoices-Export-${new Date().toISOString().split('T')[0]}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      minHeight: '100%',
      padding: '18px',
      // Stabilize the background color to prevent glow leakage during layout shifts
      backgroundColor: '#b3b3b300',
      contain: 'layout'
    }}>

      {/* Main Content Area */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>

        {/* Statistics & Actions Bar */}
        <div className="base-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Invoices</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Manage, filter, and export transaction invoices with ease.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleExportBulk}
                disabled={filteredInvoices.length === 0 || isDownloading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                  backgroundColor: filteredInvoices.length > 0 ? '#4F46E5' : 'var(--surface)',
                  border: 'none',
                  borderRadius: '10px', color: 'white',
                  fontSize: '14px', fontWeight: 600, cursor: (filteredInvoices.length > 0 && !isDownloading) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: filteredInvoices.length > 0 ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                  opacity: (filteredInvoices.length > 0 && !isDownloading) ? 1 : 0.7,
                  minWidth: '190px',
                  justifyContent: 'center'
                }}
              >
                {isDownloading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spinner" style={{ width: '14px', height: '14px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    Generating...
                  </span>
                ) : (
                  <>
                    <Download size={16} /> Export Filtered ({filteredInvoices.length})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Table Card */}
        <div className="base-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 4px', zIndex: 100 }}>
            <div style={{ display: 'flex', gap: '12px' }}>

              {/* Range Picker */}
              <div style={{ position: 'relative' }} ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: (rangeStart || rangeEnd) ? '#1D4ED8' : 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '10px', color: (rangeStart || rangeEnd) ? 'white' : 'var(--text-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <Calendar size={14} />
                  {rangeStart && rangeEnd ? `${rangeStart} - ${rangeEnd}` : rangeStart ? `From ${rangeStart}` : 'Date Range'}
                  <ChevronDown size={14} />
                </button>
                {showDatePicker && <CalendarDropdown rangeStart={rangeStart} rangeEnd={rangeEnd} onSelectRange={handleDateSelect} />}
              </div>

              {/* Advanced Filters */}
              <div style={{ position: 'relative' }} ref={filterMenuRef}>
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: (activeStatusFilter || activeMethodFilter) ? '#1D4ED8' : 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '10px', color: (activeStatusFilter || activeMethodFilter) ? 'white' : 'var(--text-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <Filter size={14} /> {activeStatusFilter || activeMethodFilter ? 'Active Filters' : 'More Filters'} <ChevronDown size={14} />
                </button>

                {showFilterMenu && (
                  <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '240px', borderRadius: '14px', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>

                    <div style={{ padding: '8px 4px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                    {['Paid', 'Unpaid'].map(opt => (
                      <button key={opt} onClick={() => { setActiveStatusFilter(activeStatusFilter === opt ? '' : opt); setCurrentPage(1); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: activeStatusFilter === opt ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}>
                        {opt} {activeStatusFilter === opt && <Check size={14} color="#4F46E5" />}
                      </button>
                    ))}

                    <div style={{ margin: '8px 0', borderTop: '1px solid var(--border)' }} />
                    <div style={{ padding: '8px 4px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</div>
                    {['Credit Card', 'UPI', 'Bank Transfer'].map(opt => (
                      <button key={opt} onClick={() => { setActiveMethodFilter(activeMethodFilter === opt ? '' : opt); setCurrentPage(1); }} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: activeMethodFilter === opt ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}>
                        {opt} {activeMethodFilter === opt && <Check size={14} color="#4F46E5" />}
                      </button>
                    ))}

                    <button
                      onClick={() => { setActiveStatusFilter(''); setActiveMethodFilter(''); setRangeStart(''); setRangeEnd(''); setShowFilterMenu(false); }}
                      style={{ marginTop: '12px', padding: '10px', background: '#FEF2F2', border: 'none', color: '#DC2626', fontSize: '12px', fontWeight: 700, borderRadius: '10px', cursor: 'pointer' }}
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Client Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Issue Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700 }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.map((inv, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedInvoice(inv)}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: selectedInvoice?.id === inv.id ? 'rgba(79, 70, 229, 0.08)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '18px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{inv.id}</td>
                    <td style={{ padding: '18px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: inv.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{inv.name[0]}</div>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{inv.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '18px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{inv.startDate}</td>
                    <td style={{ padding: '18px 16px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{inv.amount}</td>
                    <td style={{ padding: '18px 16px' }}><StatusBadge status={inv.status} /></td>
                    <td style={{ padding: '18px 16px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownloadSingle(inv); }}
                        style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', cursor: 'pointer', transition: 'all 0.2s' }}
                        title="Download PDF"
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)'}
                      >
                        <Download size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredInvoices.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
                <Filter size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <p>No invoices found matching the selected filters.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '16px 4px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Showing {filteredInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} results
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                disabled={currentPage === totalPages || filteredInvoices.length === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', cursor: (currentPage === totalPages || filteredInvoices.length === 0) ? 'not-allowed' : 'pointer', opacity: (currentPage === totalPages || filteredInvoices.length === 0) ? 0.5 : 1, fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Profile/Preview Area */}
      <div style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', gap: '20px', contain: 'layout' }}>
        <div className="base-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)' }}>❋</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>Invoices Detail</h3>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status & Summary</span>
            </div>
          </div>

          {!selectedInvoice ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Filter size={24} />
              </div>
              <p>Select an invoice to see details and download.</p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '24px', padding: '20px', border: '1.5px solid var(--border)', borderRadius: '16px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status</span>
                  <StatusBadge status={selectedInvoice.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Payment ID</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedInvoice.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Method</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{(selectedInvoice as any).method || 'Credit Card'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Date</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedInvoice.startDate}</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '14px', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>Billing To</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: selectedInvoice.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{selectedInvoice.name[0]}</div>
                  <p style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{selectedInvoice.name}</p>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedInvoice.clientAddress}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '14px', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>Plan Details</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{selectedInvoice.billName}</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#4F46E5' }}>{selectedInvoice.amount}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Type: {selectedInvoice.type}</span>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button
                  onClick={() => handleDownloadSingle(selectedInvoice)}
                  disabled={isDownloading}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
                    background: '#4F46E5',
                    color: 'white', fontWeight: 700, fontSize: '15px',
                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                    opacity: isDownloading ? 0.7 : 1,
                    minHeight: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => { if (!isDownloading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { if (!isDownloading) e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {isDownloading ? 'Generating PDF...' : 'Download Current PDF'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px' }}>This will download a single-page professional invoice.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
)
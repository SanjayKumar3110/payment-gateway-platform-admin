import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  icon?: React.ElementType;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const Dropdown = ({ label, icon: Icon, options, value, onChange }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: 'var(--surface)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
      >
        {Icon && <Icon size={14} color="var(--text-secondary)" />}
        {value ? value : label}
        <ChevronDown size={14} color="var(--text-secondary)" />
      </button>

      {open && (
        <div className="solid-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', borderRadius: '6px', width: 'max-content', minWidth: '160px', zIndex: 100 }}>
          <div
            onClick={() => { onChange(''); setOpen(false); }}
            style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Clear Filter
          </div>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: value === opt ? '#4F46E5' : 'var(--text-primary)', backgroundColor: value === opt ? 'var(--border)' : 'transparent', fontWeight: value === opt ? 600 : 400 }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'var(--border)'; }}
              onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

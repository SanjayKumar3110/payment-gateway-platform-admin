import { useState, useEffect } from 'react';
import { Folder, Search, MoreHorizontal, X } from 'lucide-react';

export type DownloadItem = { filename: string; date: Date; seen: boolean };

// Global state for downloads so it's easy to reuse anywhere without prop drilling
let globalDownloads: DownloadItem[] = [];
let listeners: ((d: DownloadItem[]) => void)[] = [];
let popupListeners: (() => void)[] = [];

export const registerDownload = (filename: string) => {
  globalDownloads = [...globalDownloads, { filename, date: new Date(), seen: false }];
  listeners.forEach(fn => fn(globalDownloads));
  popupListeners.forEach(fn => fn());
};

export const markDownloadsSeen = () => {
  globalDownloads = globalDownloads.map(d => ({ ...d, seen: true }));
  listeners.forEach(fn => fn(globalDownloads));
};

export const useDownloadsManager = () => {
  const [downloadsList, setDownloadsList] = useState<DownloadItem[]>(globalDownloads);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  useEffect(() => {
    const dListener = (ds: DownloadItem[]) => setDownloadsList(ds);
    const pListener = () => {
      setShowDownloadPopup(true);
      setTimeout(() => setShowDownloadPopup(false), 5000);
    };

    listeners.push(dListener);
    popupListeners.push(pListener);

    return () => {
      listeners = listeners.filter(f => f !== dListener);
      popupListeners = popupListeners.filter(f => f !== pListener);
    };
  }, []);

  return {
    downloadsList,
    showDownloadPopup,
    setShowDownloadPopup,
    markDownloadsSeen
  };
};

export const DownloadPopup = ({ downloads, onClose }: { downloads: DownloadItem[], onClose: () => void }) => {
  if (downloads.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      width: '320px',
      backgroundColor: '#2b2b2b',
      color: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #3d3d3d' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#fff' }}>Downloads</h3>
        <div style={{ display: 'flex', gap: '16px', color: '#ccc', alignItems: 'center' }}>
          <Folder size={18} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'} />
          <Search size={18} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'} />
          <MoreHorizontal size={18} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'} />
          <X size={18} style={{ cursor: 'pointer' }} onClick={onClose} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'} />
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '300px', overflowY: 'auto' }}>
        {downloads.slice().reverse().slice(0, 5).map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', width: '28px', height: '36px', backgroundColor: '#e53e3e', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'white' }}>PDF</span>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderBottom: '10px solid #bc2f2f', borderRight: '10px solid #2b2b2b' }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0, paddingTop: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.filename}</span>
              <a href="#" style={{ color: '#fff', fontSize: '13px', textDecoration: 'underline', width: 'fit-content' }} onClick={(e) => e.preventDefault()}>Open file</a>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 16px 16px 16px', cursor: 'pointer' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>See more</span>
      </div>
    </div>
  );
};

import { Users, Wallet, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from 'lucide-react';
import './css/components.css';

import MOCK_PRODUCTS from '../data/analytics.json';

export function Analytics() {
  return (
    <div className="desktop-split-layout">

      {/* Main Content */}
      <div className="desktop-split-main">

        {/* Overview header */}
        <div className="pv-row-sb" style={{ marginBottom: '24px' }}>
          <h2 className="pv-section-title">Overview</h2>
          <button className="pv-btn-outline">Last month <ChevronDown size={14} /></button>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div className="base-card" style={{ flex: 1 }}>
            <div className="pv-metric-label"><Users size={16} /> Customers</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '12px' }}>
              <span className="pv-metric-number">1,293</span>
              <span className="pv-badge pv-badge-red"><ArrowDown size={11} /> 36.8%</span>
            </div>
            <div className="pv-subtext" style={{ marginTop: '4px' }}>vs last month</div>
          </div>

          <div className="base-card" style={{ flex: 1 }}>
            <div className="pv-metric-label"><Wallet size={16} /> Balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '12px' }}>
              <span className="pv-metric-number">256k</span>
              <span className="pv-badge pv-badge-green"><ArrowUp size={11} /> 36.8%</span>
            </div>
            <div className="pv-subtext" style={{ marginTop: '4px' }}>vs last month</div>
          </div>
        </div>

        {/* Customer summary */}
        <div style={{ marginBottom: '28px' }}>
          <p className="pv-bold-text">857 new customers today!</p>
          <p className="pv-subtext" style={{ marginTop: '4px', marginBottom: '20px' }}>
            Send a welcome message to all new customers.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            {['Gladyce', 'Elbert', 'Dash', 'Joyce', 'Marina'].map((name, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="pv-avatar-circle" style={{ backgroundColor: `hsl(${i * 60}, 55%, 65%)` }}>
                  {name.charAt(0)}
                </div>
                <span className="pv-avatar-name">{name}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <button className="pv-view-all-btn"><ChevronRight size={18} /></button>
              <span className="pv-avatar-name">View all</span>
            </div>
          </div>
        </div>

        {/* Chart card */}
        <div className="base-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="pv-row-sb" style={{ marginBottom: '24px' }}>
            <h2 className="pv-section-title">Product view</h2>
            <button className="pv-btn-outline">Last 7 days <ChevronDown size={14} /></button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', position: 'relative', paddingTop: '60px' }}>
            <span className="pv-revenue-label">$10.2m</span>
            {[40, 60, 100, 180, 220, 120, 150].map((height, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {i === 4 && (
                  <div className="pv-chart-tooltip">2.2m</div>
                )}
                <div className="pv-chart-bar" style={{
                  height: `${height}px`,
                  background: i === 4 ? 'linear-gradient(to top, #81C784, #4CAF50)' : undefined
                }} data-inactive={i !== 4 ? 'true' : undefined}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="desktop-split-right">
        <div className="base-card" style={{ marginBottom: '24px', flex: 1 }}>
          <h2 className="pv-section-title" style={{ marginBottom: '16px' }}>Popular products</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {MOCK_PRODUCTS.map((prod, i) => (
              <div key={prod.id} className="pv-product-row" style={{
                borderBottom: i < MOCK_PRODUCTS.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="pv-product-name">{prod.name}</div>
                  <div className="pv-subtext">UI Kit</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="pv-product-price">{prod.price}</div>
                  <span className={`pv-status-badge ${prod.status === 'Active' ? 'pv-badge-active' : 'pv-badge-offline'}`}>
                    {prod.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="pv-all-products-btn">All products</button>
        </div>

        {/* Comments */}
        {/* <div className="base-card">
          <h2 className="pv-section-title" style={{ marginBottom: '16px' }}>Comments</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { initial: 'J', name: 'Joyce', link: 'Bento Pro 2.0', time: '09:00 AM', msg: 'Great work! When HTML version will be available? ⚡', color: '#34495e' },
              { initial: 'G', name: 'Gladyce', link: 'Food App', time: '09:00 AM', msg: 'Amazing. This was compatible with everything.', color: '#9b59b6', muted: true },
            ].map((c) => (
              <div key={c.name} style={{ display: 'flex', gap: '12px', opacity: c.muted ? 0.6 : 1 }}>
                <div className="pv-comment-avatar" style={{ backgroundColor: c.color }}>{c.initial}</div>
                <div>
                  <div className="pv-comment-header">
                    <span className="pv-comment-name">{c.name}</span>
                    <span className="pv-subtext"> on </span>
                    <span className="pv-comment-link">{c.link}</span>
                  </div>
                  <div className="pv-comment-time">{c.time}</div>
                  <p className="pv-comment-body">{c.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

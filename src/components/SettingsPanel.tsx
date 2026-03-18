import { useState } from 'react';
import { Save, Key, User, Shield, Bell } from 'lucide-react';
import './css/components.css';

export function SettingsPanel() {
    const [activeSection, setActiveSection] = useState('profile');

    return (
        <div className="desktop-split-layout">
            {/* Settings Navigation Sidebar */}
            <div style={{ width: '240px', paddingRight: '24px', flexShrink: 0 }}>
                <h2 className="pv-section-title" style={{ marginBottom: '24px' }}>Settings</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { id: 'profile', label: 'Business Profile', icon: User },
                        { id: 'payment', label: 'Payment Integration', icon: Key },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                    ].map(sec => (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                                borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
                                backgroundColor: activeSection === sec.id ? 'var(--border)' : 'transparent',
                                color: activeSection === sec.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: activeSection === sec.id ? 600 : 500,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <sec.icon size={18} />
                            {sec.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Settings Content Area */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div className="base-card" style={{ minHeight: '500px' }}>

                    {/* PROFILE SECTION */}
                    {activeSection === 'profile' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <h3 className="pv-product-name" style={{ fontSize: '18px', marginBottom: '8px' }}>Business Profile</h3>
                            <p className="pv-subtext" style={{ marginBottom: '24px' }}>Update your store's public information and contact details.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Store Name</label>
                                    <input type="text" defaultValue="PayPlatform Demo Store" style={{
                                        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg)', color: 'var(--text-primary)', outline: 'none'
                                    }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Support Email</label>
                                    <input type="email" defaultValue="support@payplatform.in" style={{
                                        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg)', color: 'var(--text-primary)', outline: 'none'
                                    }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Phone Number</label>
                                    <input type="text" defaultValue="+91 98765 43210" style={{
                                        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg)', color: 'var(--text-primary)', outline: 'none'
                                    }} />
                                </div>

                                <button className="cv-add-btn" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>
                                    <Save size={16} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PAYMENT INTEGRATION SECTION */}
                    {activeSection === 'payment' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <h3 className="pv-product-name" style={{ fontSize: '18px', marginBottom: '8px' }}>Payment Integration</h3>
                            <p className="pv-subtext" style={{ marginBottom: '24px' }}>Configure your Razorpay API credentials to process live transactions.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Razorpay Key ID</label>
                                    <input type="text" placeholder="rzp_test_..." style={{
                                        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace'
                                    }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Razorpay Key Secret</label>
                                    <input type="password" placeholder="••••••••••••••••" style={{
                                        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace'
                                    }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Webhook Secret</label>
                                    <input type="password" placeholder="••••••••••••••••" style={{
                                        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'monospace'
                                    }} />
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Used to verify payment.captured events.</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', padding: '16px', backgroundColor: '#FFF8E1', borderRadius: '8px', border: '1px solid #FFE082' }}>
                                    <div style={{ color: '#F59E0B' }}>⚠️</div>
                                    <div style={{ fontSize: '13px', color: '#B45309' }}>
                                        <strong>Warning:</strong> Changing API keys will interrupt active transactions.
                                    </div>
                                </div>

                                <button className="cv-add-btn" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                                    Update API Keys
                                </button>
                            </div>
                        </div>
                    )}

                    {/* OTHER SECTIONS PLACEHOLDERS */}
                    {(activeSection === 'notifications' || activeSection === 'security') && (
                        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <div style={{ marginBottom: '16px' }}>🚧</div>
                                <h3>Coming Soon</h3>
                                <p style={{ fontSize: '14px', marginTop: '8px' }}>This settings pane will be available in the next update.</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

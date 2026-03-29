import { useState } from 'react';
import { Save, Key, User, Shield, Bell, Building2, Mail, Phone, Hash, Eye, EyeOff } from 'lucide-react';
import './css/components.css';

interface UserData {
    id: string;
    email: string;
    name: string;
    businessName?: string;
    phone?: string;
    role: string;
    rz_key_id?: string;
    rz_key_secret?: string;
    rz_webhook_secret?: string;
    rz_account_id?: string;
}

interface SettingsPanelProps {
    userData: UserData | null;
}

export function SettingsPanel({ userData }: SettingsPanelProps) {
    const [activeSection, setActiveSection] = useState('profile');

    // Razorpay state — load from localStorage
    const [razorpayKeyId, setRazorpayKeyId] = useState(() => userData?.rz_key_id || localStorage.getItem('rz_key_id') || '');
    const [razorpayKeySecret, setRazorpayKeySecret] = useState(() => userData?.rz_key_secret || localStorage.getItem('rz_key_secret') || '');
    const [razorpayWebhookSecret, setRazorpayWebhookSecret] = useState(() => userData?.rz_webhook_secret || localStorage.getItem('rz_webhook_secret') || '');
    const [razorpayAccountId, setRazorpayAccountId] = useState(() => userData?.rz_account_id || localStorage.getItem('rz_account_id') || '');
    const [showSecret, setShowSecret] = useState(false);
    const [showWebhookSecret, setShowWebhookSecret] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleSaveRazorpay = async () => {
        setSaveStatus('saving');
        
        // Save to LocalStorage for quick access
        localStorage.setItem('rz_key_id', razorpayKeyId);
        localStorage.setItem('rz_key_secret', razorpayKeySecret);
        localStorage.setItem('rz_webhook_secret', razorpayWebhookSecret);
        localStorage.setItem('rz_account_id', razorpayAccountId);

        // Sync to backend user.json persistent storage
        if (userData?.email) {
            try {
                const response = await fetch('http://localhost:5000/api/update-keys', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userData.email,
                        rz_key_id: razorpayKeyId,
                        rz_key_secret: razorpayKeySecret,
                        rz_webhook_secret: razorpayWebhookSecret,
                        rz_account_id: razorpayAccountId
                    })
                });
                if (response.ok) {
                    const result = await response.json();
                    // Update main localized memory with the synced copy back
                    localStorage.setItem('payplatform_user', JSON.stringify(result.user));
                }
            } catch (err) {
                console.error('Failed to sync keys to backend', err);
            }
        }

        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
    };

    /* ── Shared input style ── */
    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
        background: 'var(--input-bg)', backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)', color: 'var(--text-primary)',
        outline: 'none', fontFamily: 'monospace', fontSize: '13px', width: '100%'
    };

    const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' };
    // const hintStyle: React.CSSProperties = { fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' };

    /* ── Read-only field renderer ── */
    const ProfileField = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '16px 20px', borderRadius: '12px',
            background: 'var(--input-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--border)',
            transition: 'all 0.2s ease'
        }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
            }}>
                <Icon size={18} style={{ color: '#818CF8' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                    {value || '—'}
                </span>
            </div>
        </div>
    );

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

                    {/* PROFILE SECTION — READ ONLY */}
                    {activeSection === 'profile' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <h3 className="pv-product-name" style={{ fontSize: '18px', marginBottom: '8px' }}>Business Profile</h3>
                            <p className="pv-subtext" style={{ marginBottom: '8px' }}>
                                Your registered business information. This data was provided during sign-up.
                            </p>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', borderRadius: '20px', marginBottom: '28px',
                                background: 'rgba(99, 102, 241, 0.08)',
                                border: '1px solid rgba(99, 102, 241, 0.15)',
                                fontSize: '12px', fontWeight: 500, color: '#818CF8'
                            }}>
                                <Shield size={12} /> Read-only — contact support to update
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px' }}>
                                <ProfileField icon={User} label="Owner Name" value={userData?.name || ''} />
                                <ProfileField icon={Building2} label="Business Name" value={userData?.businessName || ''} />
                                <ProfileField icon={Mail} label="Email Address" value={userData?.email || ''} />
                                <ProfileField icon={Phone} label="Phone Number" value={userData?.phone || ''} />
                                <ProfileField icon={Hash} label="User ID" value={userData?.id || ''} />
                            </div>
                        </div>
                    )}

                    {/* RAZORPAY INTEGRATION SECTION */}
                    {activeSection === 'payment' && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <h3 className="pv-product-name" style={{ fontSize: '18px', margin: 0 }}>Razorpay Integration</h3>
                                <img src="https://cdn.razorpay.com/static/assets/logo/payment.svg" alt="Razorpay" style={{ height: '20px', opacity: 0.7 }}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            </div>
                            <p className="pv-subtext" style={{ marginBottom: '28px' }}>
                                Connect your Razorpay account to accept payments. Find your credentials in the{' '}
                                <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 500 }}>
                                    Razorpay Dashboard → API Keys
                                </a>.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '560px' }}>
                                {razorpayKeyId === 'DEMO' && (
                                    <div style={{
                                        padding: '12px 16px', borderRadius: '10px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                        color: '#818CF8', fontSize: '13px', fontWeight: 500,
                                        display: 'flex', alignItems: 'center', gap: '10px'
                                    }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#818CF8', animation: 'pulse 2s infinite' }}></div>
                                        <span>Testing with <strong>Demo Mode</strong>. No real transactions will be processed.</span>
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    {/* Key ID */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={labelStyle}>Key ID</label>
                                        <input
                                            type="text"
                                            placeholder="rzp_test_xxxxxx"
                                            value={razorpayKeyId}
                                            onChange={(e) => setRazorpayKeyId(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* Key Secret */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={labelStyle}>Key Secret</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showSecret ? 'text' : 'password'}
                                                placeholder="••••••••••••"
                                                value={razorpayKeySecret}
                                                onChange={(e) => setRazorpayKeySecret(e.target.value)}
                                                style={{ ...inputStyle, paddingRight: '42px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSecret(!showSecret)}
                                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                            >
                                                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    {/* Webhook Secret */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={labelStyle}>Webhook Secret</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showWebhookSecret ? 'text' : 'password'}
                                                placeholder="Optional secret"
                                                value={razorpayWebhookSecret}
                                                onChange={(e) => setRazorpayWebhookSecret(e.target.value)}
                                                style={{ ...inputStyle, paddingRight: '42px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                            >
                                                {showWebhookSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Account ID (optional) */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={labelStyle}>Merchant ID <span style={{ fontWeight: 400, opacity: 0.6 }}>(Optional)</span></label>
                                        <input
                                            type="text"
                                            placeholder="acc_xxxxxx"
                                            value={razorpayAccountId}
                                            onChange={(e) => setRazorpayAccountId(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    padding: '16px', borderRadius: '12px', background: 'var(--bg)',
                                    border: '1px solid var(--border)', marginTop: '8px'
                                }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={14} style={{ color: '#818CF8' }} /> Connection Help
                                    </h4>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#818CF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Get API Keys →
                                        </a>
                                        <a href="https://razorpay.com/docs/webhooks" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#818CF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Webhook Guide →
                                        </a>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                                            Use "DEMO" to test without keys.
                                        </div>
                                    </div>
                                </div>

                                {/* Warning banner */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px',
                                    padding: '14px 16px', borderRadius: '10px',
                                    background: 'rgba(245, 158, 11, 0.08)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)'
                                }}>
                                    <span style={{ fontSize: '16px' }}>⚠️</span>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        <strong style={{ color: 'var(--text-primary)' }}>Warning:</strong> Changing API keys will interrupt any active payment sessions.
                                    </span>
                                </div>

                                {/* Save button */}
                                <button
                                    className="cv-add-btn"
                                    onClick={handleSaveRazorpay}
                                    disabled={saveStatus === 'saving'}
                                    style={{ alignSelf: 'flex-start', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Save size={16} />
                                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : 'Save API Keys'}
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

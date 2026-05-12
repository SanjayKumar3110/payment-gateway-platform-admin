import { useState } from 'react';
import { User, Shield, HelpCircle, Eye, EyeOff, Copy, Cloud, Check, Sun, Monitor, Moon, UserCircle, MoreHorizontal, Link2, Smartphone, QrCode, Wallet, CreditCard, IndianRupee, Download, Upload, UploadCloud, Mail, Phone, BookOpen, ExternalLink } from 'lucide-react';
import './css/components.css';
import { HelpFeedbackForm } from './utils/supportUtil';

interface UserData {
    id: string;
    email: string;
    name: string;
    businessName?: string;
    // phone?: string;
    role: string;
    rz_key_id?: string;
    rz_key_secret?: string;
    rz_webhook_secret?: string;
    rz_account_id?: string;
}

interface SettingsPanelProps {
    userData: UserData | null;
    darkMode?: boolean;
    setDarkMode?: (dark: boolean) => void;
}

export function SettingsPanel({ userData, darkMode, setDarkMode }: SettingsPanelProps) {
    const [activeSection, setActiveSection] = useState('General');

    // General state
    const [pushNotifs, setPushNotifs] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [smsNotifs, setSmsNotifs] = useState(false);
    const [theme, setThemeState] = useState<'light' | 'auto' | 'dark'>(darkMode ? 'dark' : 'light');
    const [showQR, setShowQR] = useState(false);
    const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
    const [qrError, setQrError] = useState<string | null>(null);
    const [razorpayConn, setRazorpayConn] = useState(() => !!(userData?.rz_key_id || localStorage.getItem('rz_key_id')));
    const [paytmConn, setPaytmConn] = useState(() => !!localStorage.getItem('paytm_key_id'));
    const [phonepeConn, setPhonepeConn] = useState(() => !!localStorage.getItem('phonepe_key_id'));

    const [showGatewayPopup, setShowGatewayPopup] = useState<string | null>(null);
    const [showGatewaySecret, setShowGatewaySecret] = useState(false);
    const [tempApiKey, setTempApiKey] = useState('');
    const [tempSecretKey, setTempSecretKey] = useState('');
    const [modalKey, setModalKey] = useState(0); // incremented each open to force fresh remount
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [gatewayStatus, setGatewayStatus] = useState<'idle' | 'saved' | 'deleted'>('idle');

    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showImportPopup, setShowImportPopup] = useState(false);
    const [openSessionMenu, setOpenSessionMenu] = useState<string | null>(null);

    const setTheme = (t: 'light' | 'auto' | 'dark') => {
        setThemeState(t);
        if (setDarkMode) {
            if (t === 'light') setDarkMode(false);
            if (t === 'dark') setDarkMode(true);
            if (t === 'auto') {
                const isDarkMatch = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setDarkMode(isDarkMatch);
            }
        }
    };

    const handleConnectApp = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/remote-access`);
            if (res.ok) {
                const data = await res.json();
                setQrImageUrl(data.qrCode);
                setQrError(null);
            } else {
                setQrImageUrl(null);
                setQrError('no qr to generate');
            }
        } catch (err) {
            setQrImageUrl(null);
            setQrError('no qr to generate');
        }
        setShowQR(true);
    };

    const handleSaveGatewayKeys = async (newApiId: string, newSecret: string) => {
        if (!userData?.email) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/update-keys`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    key_id: newApiId,
                    key_secret: newSecret
                })
            });
            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('payplatform_user', JSON.stringify(result.user));
            }
        } catch (err) {
            console.error('Failed to sync gateway keys', err);
        }
    };

    // Helper: always read fresh from localStorage so stale React state never leaks into inputs
    const openGatewayPopup = (gateway: string) => {
        let apiKey = '';
        let secretKey = '';
        if (gateway === 'Razorpay') {
            apiKey = localStorage.getItem('rz_key_id') ?? '';
            secretKey = localStorage.getItem('rz_key_secret') ?? '';
        } else if (gateway === 'Paytm') {
            apiKey = localStorage.getItem('paytm_key_id') ?? '';
            secretKey = localStorage.getItem('paytm_key_secret') ?? '';
        } else if (gateway === 'PhonePe') {
            apiKey = localStorage.getItem('phonepe_key_id') ?? '';
            secretKey = localStorage.getItem('phonepe_key_secret') ?? '';
        }
        setTempApiKey(apiKey);
        setTempSecretKey(secretKey);
        setShowGatewaySecret(false);
        setConfirmDelete(false);
        setGatewayStatus('idle');
        setModalKey(k => k + 1); // force full remount of modal inputs
        setShowGatewayPopup(gateway);
    };

    /* ── Shared input style ── */
    const inputStyle: React.CSSProperties = {
        padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)',
        background: 'var(--input-bg)', backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)', color: 'var(--text-primary)',
        outline: 'none', fontFamily: 'monospace', fontSize: '13px', width: '100%'
    };

    const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' };

    const ProfileRow = ({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) => {
        const [copied, setCopied] = useState(false);
        const copyToClipboard = () => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>{value}</span>
                    {copyable && (
                        <button onClick={copyToClipboard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
            <div
                onClick={() => onChange(!checked)}
                style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    backgroundColor: checked ? '#8b5cf6' : 'var(--border)',
                    position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
                }}
            >
                <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
                    position: 'absolute', top: '2px', left: checked ? '22px' : '2px',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
            </div>
        </div>
    );

    const ThemeOption = ({ label, icon: Icon, selected, onClick }: { label: string; icon: any; selected: boolean; onClick: () => void }) => (
        <button
            onClick={onClick}
            style={{
                flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                backgroundColor: selected ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                border: selected ? '2px solid #8b5cf6' : '2px solid var(--border)',
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                color: selected ? '#8b5cf6' : 'var(--text-secondary)'
            }}
        >
            <Icon size={32} />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{label}</span>
        </button>
    );

    const SessionMenuButton = ({ id }: { id: string }) => (
        <div style={{ position: 'relative', justifySelf: 'end' }}>
            <MoreHorizontal
                size={16}
                color="var(--text-secondary)"
                style={{ cursor: 'pointer', display: 'block' }}
                onClick={() => setOpenSessionMenu(openSessionMenu === id ? null : id)}
            />
            {openSessionMenu === id && (
                <div>
                    <button
                        onClick={() => setOpenSessionMenu(null)}
                        style={{
                            background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-primary)',
                            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            position: 'absolute', top: '100%', right: 0, marginTop: '6px', zIndex: 50, width: '120px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="desktop-split-layout">
            {/* Settings Navigation Sidebar */}
            <div style={{ width: '240px', paddingRight: '24px', flexShrink: 0 }}>
                <h2 className="pv-section-title" style={{ marginBottom: '24px' }}>Settings</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { id: 'General', label: 'General', icon: User },
                        { id: 'account', label: 'Account', icon: UserCircle },
                        { id: 'connectors', label: 'Connectors', icon: Link2 },
                        { id: 'storage', label: 'Storage', icon: Cloud },
                        { id: 'help', label: 'Get Help', icon: HelpCircle },
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
            <div style={{ flex: 1, minWidth: 0, maxWidth: '700px' }}>

                {/* GENERAL SECTION */}
                {activeSection === 'General' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
                        {/* Profile */}
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Profile</h3>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <ProfileRow label="Name" value={userData?.name || '—'} />
                                <ProfileRow label="Email" value={userData?.email || '—'} />
                                {/* <ProfileRow label="Phone Number" value={userData?.phone || '—'} /> */}
                                <ProfileRow label="Business ID" value={userData?.id || '—'} copyable />
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: 0 }} />

                        {/* Notifications */}
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Notification</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Toggle label="Push Notifications" checked={pushNotifs} onChange={setPushNotifs} />
                                <Toggle label="Email Notifications" checked={emailNotifs} onChange={setEmailNotifs} />
                                <Toggle label="SMS Notifications" checked={smsNotifs} onChange={setSmsNotifs} />
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: 0 }} />

                        {/* Appearance */}
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Appearance</h3>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <ThemeOption label="Light" icon={Sun} selected={theme === 'light'} onClick={() => setTheme('light')} />
                                <ThemeOption label="Auto" icon={Monitor} selected={theme === 'auto'} onClick={() => setTheme('auto')} />
                                <ThemeOption label="Dark" icon={Moon} selected={theme === 'dark'} onClick={() => setTheme('dark')} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ACCOUNT SECTION */}
                {activeSection === 'account' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '700px' }}>
                        {/* Account */}
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>Account</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Organization ID */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Business ID</span>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)',
                                        padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)'
                                    }}>
                                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{userData?.id || '—'}</span>
                                        <Copy size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                                    </div>
                                </div>
                                {/* Log out of all devices */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Log out of all devices</span>
                                    <button style={{
                                        background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)',
                                        padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                                    }}>
                                        Log out
                                    </button>
                                </div>

                            </div>
                        </div>

                        <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: 0 }} />

                        {/* Active sessions */}
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Active sessions</h3>

                            <div style={{ width: '100%', borderCollapse: 'collapse', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) 40px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Device</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Created</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Updated</span>
                                    <span></span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) 40px', paddingTop: '16px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Desktop (Windows)</span>
                                        <span style={{ fontSize: '10px', background: 'var(--border)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Current</span>
                                    </div>

                                    <span style={{ padding: '8px 6px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Mar 12, 2026, 6:58 PM</span>
                                    <span style={{ padding: '8px 6px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Apr 4, 2026, 11:26 AM</span>
                                    <SessionMenuButton id="desktop" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) 40px', paddingTop: '16px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Mobile (Android)</span>
                                        <span style={{ fontSize: '10px', background: 'var(--border)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Active</span>
                                    </div>
                                    <span style={{ padding: '8px 6px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Mar 12, 2026, 6:58 PM</span>
                                    <span style={{ padding: '8px 6px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Apr 4, 2026, 11:26 AM</span>
                                    <SessionMenuButton id="android" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) 40px', paddingTop: '16px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>Mobile (iOS)</span>
                                        <span style={{ fontSize: '10px', background: 'var(--border)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Active</span>
                                    </div>
                                    <span style={{ padding: '8px 6px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Mar 14, 2026, 6:58 PM</span>
                                    <span style={{ padding: '8px 6px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>Apr 4, 2026, 11:26 AM</span>
                                    <SessionMenuButton id="ios" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONNECTORS SECTION */}
                {activeSection === 'connectors' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '700px' }}>
                        {/* Connect to mobile app */}
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Connect to mobile app</h3>

                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)',
                                borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Smartphone size={24} color="#8b5cf6" />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>PayPlatform Mobile Admin</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Organization ID <span style={{ fontFamily: 'monospace', marginLeft: '4px' }}>{userData?.id || '—'}</span></p>
                                    </div>
                                </div>

                                {!showQR ? (
                                    <button
                                        onClick={handleConnectApp}
                                        style={{
                                            background: '#8b5cf6', border: 'none', color: '#ffffff',
                                            padding: '8px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                                        }}
                                    >
                                        Connect
                                    </button>
                                ) : (
                                    <div style={{ padding: '8px', background: '#fff', borderRadius: '8px', border: '1px solid var(--border)', animation: 'fadeIn 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '74px', minHeight: '74px' }}>
                                        {qrImageUrl ? (
                                            <img src={qrImageUrl} alt="QR Code" style={{ width: '80px', height: '80px' }} />
                                        ) : qrError ? (
                                            <span style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{qrError}</span>
                                        ) : (
                                            <QrCode size={56} color="#000" />
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>

                        <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: 0 }} />

                        {/* Integrations (Razorpay, Paytm, PhonePe) */}
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Payment Gateways</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>

                                {/* Razorpay */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--surface)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CreditCard size={20} color="#3b82f6" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Razorpay</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Accept domestic and international payments.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openGatewayPopup('Razorpay')}
                                        style={{ background: razorpayConn ? 'rgba(16, 185, 129, 0.1)' : 'transparent', border: razorpayConn ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)', color: razorpayConn ? '#10b981' : 'var(--text-primary)', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {razorpayConn ? 'Connected' : 'Connect'}
                                    </button>
                                </div>

                                {/* Paytm */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--surface)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Wallet size={20} color="#06b6d4" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Paytm</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Indian wallet and UPI payment network.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openGatewayPopup('Paytm')}
                                        style={{ background: paytmConn ? 'rgba(16, 185, 129, 0.1)' : 'transparent', border: paytmConn ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)', color: paytmConn ? '#10b981' : 'var(--text-primary)', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {paytmConn ? 'Connected' : 'Connect'}
                                    </button>
                                </div>

                                {/* PhonePe */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--surface)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IndianRupee size={20} color="#a855f7" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>PhonePe</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Fast UPI payments via PhonePe.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openGatewayPopup('PhonePe')}
                                        style={{ background: phonepeConn ? 'rgba(16, 185, 129, 0.1)' : 'transparent', border: phonepeConn ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)', color: phonepeConn ? '#10b981' : 'var(--text-primary)', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {phonepeConn ? 'Connected' : 'Connect'}
                                    </button>
                                </div>
                            </div>
                            <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg)', border: '1px solid var(--border)', marginTop: '8px' }}>
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
                        </div>
                    </div>
                )}

                {/* STORAGE SECTION */}
                {activeSection === 'storage' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '700px' }}>
                        {/* Cloud backup */}
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Cloud Backup</h3>
                            <div style={{
                                padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)',
                                borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Last Backup</h4>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Today at 10:42 AM • 42 MB</span>
                                </div>
                                <button style={{
                                    background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)',
                                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                                }}>
                                    Backup Now
                                </button>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: '0 0 32px 0' }} />

                        {/* External data */}
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>External Data</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Export */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Export Data</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Download a copy of your data locally.</p>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            onClick={() => setShowExportMenu(!showExportMenu)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            <Download size={16} /> Export
                                        </button>
                                        {showExportMenu && (
                                            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px', zIndex: 10, width: '120px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                                <button onClick={() => setShowExportMenu(false)} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' }}>as JSON</button>
                                                <button onClick={() => setShowExportMenu(false)} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' }}>as CSV</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Import */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Import Data</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Restore from a previous backup.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowImportPopup(true)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#8b5cf6', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        <Upload size={16} /> Import
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* GET HELP SECTION */}
                {activeSection === 'help' && (
                    <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '40px' }}>

                        {/* ── About ── */}
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>About</h3>
                            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: '0 0 20px 0' }} />
                            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', lineHeight: 1.8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Shield size={20} color="#8b5cf6" />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>PayPlatform Admin</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Version 0.1.0 — Alpha</p>
                                    </div>
                                </div>
                                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>PayPlatform Admin</strong> is a powerful, all-in-one payment operations dashboard designed for businesses that process digital transactions. It gives you real-time visibility into payments, automated invoice generation, deep analytics, and seamless integration with India's leading payment gateways — Razorpay, Paytm, and PhonePe.
                                </p>
                                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    Built as an Electron-based desktop application, it runs entirely on your local machine for maximum security and performance. Data is stored locally and synced through your configured backend — giving you complete ownership of your business data.
                                </p>
                                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    Whether you're tracking live transactions, managing customer invoices, or analysing revenue trends — PayPlatform Admin is built to keep you in control.
                                </p>
                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#8b5cf6', textDecoration: 'none', padding: '8px 16px', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', background: 'rgba(139,92,246,0.07)' }}
                                >
                                    <BookOpen size={14} /> User Manual <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>

                        {/* ── Feedback ── */}
                        <HelpFeedbackForm darkMode={darkMode} />

                        {/* ── Contact ── */}
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Contact</h3>
                            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: '0 0 20px 0' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Mail size={18} color="#8b5cf6" />
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>dev@payplatform.in</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Phone size={18} color="#10b981" />
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Phone</p>
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>+91 98765 43210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            {/* CONNECTION POPUP MODAL */}
            {showGatewayPopup && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}>
                    <div key={modalKey} style={{ background: 'var(--bg)', padding: '28px', borderRadius: '16px', width: '420px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700 }}>Connect {showGatewayPopup}</h3>
                            <button onClick={() => { setShowGatewayPopup(null); setConfirmDelete(false); setGatewayStatus('idle'); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                        </div>

                        {/* Success / Deleted banner */}
                        {gatewayStatus === 'saved' && (
                            <div style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
                                ✓ Connected successfully
                            </div>
                        )}
                        {gatewayStatus === 'deleted' && (
                            <div style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
                                Keys deleted successfully
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={labelStyle}>API Key / Merchant ID</label>
                            <input
                                key={`api-${modalKey}`}
                                type="text"
                                defaultValue={tempApiKey}
                                onChange={(e) => setTempApiKey(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter your public API key"
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={labelStyle}>Secret Key</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    key={`secret-${modalKey}`}
                                    type={showGatewaySecret ? 'text' : 'password'}
                                    defaultValue={tempSecretKey}
                                    onChange={(e) => setTempSecretKey(e.target.value)}
                                    style={{ ...inputStyle, paddingRight: '42px' }}
                                    placeholder="Enter your secret key"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowGatewaySecret(!showGatewaySecret)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                >
                                    {showGatewaySecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Inline delete confirmation */}
                        {confirmDelete ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <p style={{ margin: 0, fontSize: '13px', color: '#ef4444', fontWeight: 600, textAlign: 'center' }}>Delete saved API keys for {showGatewayPopup}?</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Cancel</button>
                                    <button
                                        onClick={() => {
                                            const gw = showGatewayPopup;
                                            // Clear all per-gateway keys
                                            if (gw === 'Razorpay') { localStorage.removeItem('rz_key_id'); localStorage.removeItem('rz_key_secret'); }
                                            if (gw === 'Paytm') { localStorage.removeItem('paytm_key_id'); localStorage.removeItem('paytm_key_secret'); }
                                            if (gw === 'PhonePe') { localStorage.removeItem('phonepe_key_id'); localStorage.removeItem('phonepe_key_secret'); }
                                            handleSaveGatewayKeys('', '');
                                            if (gw === 'Razorpay') setRazorpayConn(false);
                                            if (gw === 'Paytm') setPaytmConn(false);
                                            if (gw === 'PhonePe') setPhonepeConn(false);
                                            setConfirmDelete(false);
                                            setGatewayStatus('deleted');
                                            setTimeout(() => { setShowGatewayPopup(null); setGatewayStatus('idle'); }, 1200);
                                        }}
                                        style={{ flex: 1, background: '#ef4444', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                                    >Confirm Delete</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '4px' }}>
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        const gw = showGatewayPopup;
                                        const apiId = tempApiKey.trim();
                                        const secret = tempSecretKey.trim();
                                        // Save to correct localStorage keys per gateway
                                        if (gw === 'Razorpay') { localStorage.setItem('rz_key_id', apiId); localStorage.setItem('rz_key_secret', secret); }
                                        if (gw === 'Paytm') { localStorage.setItem('paytm_key_id', apiId); localStorage.setItem('paytm_key_secret', secret); }
                                        if (gw === 'PhonePe') { localStorage.setItem('phonepe_key_id', apiId); localStorage.setItem('phonepe_key_secret', secret); }
                                        handleSaveGatewayKeys(apiId, secret);
                                        if (gw === 'Razorpay') setRazorpayConn(!!(apiId && secret));
                                        if (gw === 'Paytm') setPaytmConn(!!(apiId && secret));
                                        if (gw === 'PhonePe') setPhonepeConn(!!(apiId && secret));
                                        setGatewayStatus('saved');
                                        setTimeout(() => { setShowGatewayPopup(null); setGatewayStatus('idle'); }, 1200);
                                    }}
                                    style={{ background: '#8b5cf6', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', flex: 1 }}
                                >
                                    Save & Connect
                                </button>
                            </div>
                        )}
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
                    </div>
                </div>
            )}

            {/* IMPORT MODAL */}
            {showImportPopup && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}>
                    <div style={{ background: 'var(--bg)', padding: '32px', borderRadius: '16px', width: '500px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700 }}>Import Data</h3>
                            <button onClick={() => setShowImportPopup(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{
                            border: '2px dashed var(--border)', borderRadius: '12px', padding: '48px 24px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                            background: 'var(--surface)', cursor: 'pointer', transition: 'border-color 0.2s'
                        }}>
                            <UploadCloud size={48} color="#8b5cf6" />
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    Drag and drop files here
                                </p>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    ZIP folders, JSON, or CSV files supported.
                                </p>
                            </div>
                            <button style={{
                                marginTop: '8px', background: 'transparent', border: '1px solid var(--border)',
                                color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                            }}>
                                Browse Files
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

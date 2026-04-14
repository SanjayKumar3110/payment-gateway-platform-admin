import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Hexagon, Chrome, Shield, Zap, Globe, User, Building2, Phone } from 'lucide-react';
import { PassReset } from './passReset';
import './Login.css';

interface UserData {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  phone?: string;
  role: string;
}

interface LoginPageProps {
  onLogin: (email: string, token: string, user: UserData) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordChangedMessage, setPasswordChangedMessage] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setBusinessName('');
    setPhone('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!name || !email || !password) {
        setError('Name, email, and password are required');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
    }

    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = isSignUp
        ? `${baseUrl}/api/signup`
        : `${baseUrl}/api/login`;

      const body = isSignUp
        ? { name, businessName, email, phone, password }
        : { email, password };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      if (data.token) {
        onLogin(email, data.token, data.user);
      }

    } catch (err) {
      console.error("Connection error:", err);
      setError('Cannot connect to the server. Is port 5000 running?');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">

      {/* ═══ LEFT — Immersive Branding Hero ═══ */}
      <div className="login-left">
        {/* Floating glow orbs */}
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />

        <div className="login-brand">
          <div className="login-brand-icon">
            <Hexagon size={36} color="#fff" strokeWidth={2} />
          </div>
          <h1>PayPlatform</h1>
          <p className="login-brand-tagline">
            Next-generation payment infrastructure for modern businesses.
            Real-time analytics, seamless transactions, enterprise-grade security.
          </p>

          <div className="login-stats">
            <div className="login-stat">
              <span className="login-stat-value">12K+</span>
              <span className="login-stat-label">Transactions</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-value">99.9%</span>
              <span className="login-stat-label">Uptime</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-value">$2.4M</span>
              <span className="login-stat-label">Processed</span>
            </div>
          </div>

          <div className="login-trust">
            <div className="login-trust-item">
              <Shield size={14} /> SOC 2 Certified
            </div>
            <div className="login-trust-item">
              <Zap size={14} /> &lt;50ms Latency
            </div>
            <div className="login-trust-item">
              <Globe size={14} /> 40+ Countries
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT — Sign-In / Sign-Up Form ═══ */}
      <div className="login-right">
        {isForgotPassword ? (
          <PassReset 
            onBack={() => setIsForgotPassword(false)} 
            onSuccess={() => {
              setIsForgotPassword(false);
              setPasswordChangedMessage(true);
              setTimeout(() => setPasswordChangedMessage(false), 3000);
            }} 
          />
        ) : (
        <div className="login-form-panel" style={{ position: 'relative' }}>
          {passwordChangedMessage && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#e6f7edf0', color: '#0d8246', padding: '12px 24px', borderRadius: '8px', zIndex: 10, border: '1px solid #7ce3a2', fontWeight: 500, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              Password changed!
            </div>
          )}
          <div className="login-header">
            <h2>{isSignUp ? 'Create Account' : 'Welcome back'}</h2>
            <p>{isSignUp ? 'Sign up to get started with PayPlatform' : 'Sign in to your admin dashboard'}</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            {/* ── Sign Up extra fields ── */}
            {isSignUp && (
              <>
                <div className="login-input-group">
                  <label htmlFor="signup-name">Full Name *</label>
                  <div className="login-input-wrapper">
                    <User size={18} className="login-input-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      className="login-input"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="login-input-group">
                  <label htmlFor="signup-business">Business Name</label>
                  <div className="login-input-wrapper">
                    <Building2 size={18} className="login-input-icon" />
                    <input
                      id="signup-business"
                      type="text"
                      className="login-input"
                      placeholder="Your Company Ltd."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="login-input-group">
                  <label htmlFor="signup-phone">Phone Number</label>
                  <div className="login-input-wrapper">
                    <Phone size={18} className="login-input-icon" />
                    <input
                      id="signup-phone"
                      type="tel"
                      className="login-input"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="login-input-group">
              <label htmlFor="login-email">Email *</label>
              <div className="login-input-wrapper">
                <Mail size={18} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  placeholder="admin@payplatform.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label htmlFor="login-password">Password *</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="login-options-row">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" className="login-forgot" onClick={() => setIsForgotPassword(true)}>Forgot password?</button>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading && <span className="login-btn-spinner" />}
              {isLoading
                ? (isSignUp ? 'Creating account...' : 'Signing in...')
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </button>

            {!isSignUp && (
              <>
                <div className="login-divider">
                  <span>or continue with</span>
                </div>

                <div className="login-social-row">
                  <button type="button" className="login-social-btn">
                    <Chrome size={16} /> Google
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="login-footer">
            {isSignUp ? (
              <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); resetForm(); }}>Sign In</a></>
            ) : (
              <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); resetForm(); }}>Sign Up</a></>
            )}
          </div>
        </div>
        )}
      </div>

    </div>
  );
}

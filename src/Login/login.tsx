import { useState } from 'react';
import { Rocket, Eye, EyeOff } from 'lucide-react';
import './Login.css';
import { SignupPage } from './signup';
import { PassReset } from './passReset';

interface UserData {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  role: string;
}

interface LoginPageProps {
  onLogin: (email: string, token: string, user: UserData) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
 const [viewMode, setViewMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
      {/* ═══ LEFT — Branding Hero ═══ */}
      <div className="login-left">
        <h1 className="left-hero-text">Plan your activities and control your<br />progress online</h1>
        <div className="rocket-illustration-container">
          <div className="stars">
            <div className="star" style={{ top: '10%', left: '30%' }}>✕</div>
            <div className="star" style={{ top: '15%', left: '60%' }}>✕</div>
            <div className="star" style={{ top: '40%', left: '75%' }}>✕</div>
            <div className="star" style={{ top: '55%', left: '20%' }}>✕</div>
            <div className="star" style={{ top: '50%', left: '80%' }}>✕</div>
            <div className="star" style={{ top: '65%', left: '85%' }}>✕</div>
            <div className="star" style={{ top: '30%', left: '15%' }}>✕</div>
          </div>
          <Rocket size={120} color="#fff" strokeWidth={1} className="rocket-icon" />
          <div className="rocket-clouds">
            <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="#fff" strokeWidth="1" d="M 20,70 Q 20,40 40,40 Q 50,20 70,20 Q 85,20 90,30 Q 100,5 130,5 Q 160,5 165,30 Q 180,30 185,50 Q 185,70 185,70 Z" />
              <path fill="none" stroke="#fff" strokeWidth="1" d="M 50,70 Q 50,50 70,50" opacity="0.5" />
              <path fill="none" stroke="#fff" strokeWidth="1" d="M 120,70 Q 120,40 140,40" opacity="0.5" />
            </svg>
          </div>
          <div className="rocket-base-line" />
        </div>
        <div className="login-pager">
          <div className="pager-dot"></div>
          <div className="pager-dot active"></div>
          <div className="pager-dot"></div>
          <div className="pager-dot"></div>
        </div>
      </div>

      {/* ═══ RIGHT — Sign-In / Sign-Up Form ═══ */}
      {/* ═══ RIGHT — Sign-In / Sign-Up / Reset Form ═══ */}
      <div className="login-right">

        {/* 3. Only show the Sign In / Sign Up toggle if we are NOT in reset mode */}
        {viewMode !== 'reset' && (
          <div className="top-toggle-container">
            <div className="top-toggle">
              <button 
                type="button" 
                className={viewMode === 'login' ? 'active' : ''} 
                onClick={() => { setViewMode('login'); resetForm(); }}
              >
                Sign In
              </button>
              <button 
                type="button" 
                className={viewMode === 'signup' ? 'active' : ''} 
                onClick={() => { setViewMode('signup'); resetForm(); }}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        <div className="login-form-panel">
          {/* 4. Conditional Rendering Logic */}
          {viewMode === 'reset' ? (
            <PassReset 
              onBack={() => setViewMode('login')} 
              onSuccess={() => {
                setViewMode('login');
                resetForm();
              }} 
            />
          ) : viewMode === 'signup' ? (
            <SignupPage 
              onSwitchToLogin={() => setViewMode('login')} 
              onLoginSuccess={onLogin} 
            />
          ) : (
            <>
              <div className="login-header">
                <h2>
                  <span className="text-active underline">Sign In</span>
                </h2>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="login-error">{error}</div>}

                <div className="login-input-group">
                  <label htmlFor="login-email">EMAIL</label>
                  <div className="login-input-wrapper">
                    <input
                      id="login-email"
                      type="email"
                      className="login-input"
                      placeholder="Your email goes here"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="login-input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="login-password" style={{ marginBottom: 0 }}>PASSWORD</label>
                  </div>
                  <div className="login-input-wrapper input-with-icon">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      className="login-input pr-10"
                      placeholder=".........."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <div className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                  </div>
                </div>

                {/* 5. Updated Forgot Password link to change viewMode */}
                <div 
                  className="forgot-password-link" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setViewMode('reset')}
                >
                  <div style={{ marginTop: 0 }}>Forgot Password?</div>
                </div>

                <div className="login-actions" style={{ marginTop: '20px' }}>
                  <button type="submit" className="login-submit-btn" disabled={isLoading}>
                    {isLoading && <span className="login-btn-spinner" />}
                    Sign In
                  </button>
                  <button 
                    type="button"
                    className="bottom-link" 
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    onClick={() => setViewMode('signup')}
                  >
                    Create an account
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
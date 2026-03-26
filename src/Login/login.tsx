import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Hexagon, Chrome, Shield, Zap, Globe } from 'lucide-react';
import './Login.css';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Send credentials directly to your backend
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Handle incorrect passwords or missing users
      if (!response.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }

      // 3. Success! Pass the token up to App.tsx
      setIsLoading(false);
      if (data.token) {
        onLogin(email, data.token);
      }

    } catch (err) {
      // 4. Catch server crashes or CORS errors
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

      {/* ═══ RIGHT — Sign-In Form ═══ */}
      <div className="login-right">
        <div className="login-form-panel">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to your admin dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="login-input-group">
              <label htmlFor="login-email">Email</label>
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
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            <div className="login-options-row">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="login-forgot">Forgot password?</button>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading && <span className="login-btn-spinner" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="login-divider">
              <span>or continue with</span>
            </div>

            <div className="login-social-row">
              <button type="button" className="login-social-btn">
                <Chrome size={16} /> Google
              </button>
            </div>
          </form>

          <div className="login-footer">
            Don't have an account? <a href="#">Contact Admin</a>
          </div>
        </div>
      </div>

    </div>
  );
}

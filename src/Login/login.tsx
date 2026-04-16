import { useState } from 'react';
import { Rocket } from 'lucide-react';
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
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
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
      if (!agreed) {
        setError('Please agree to the Terms of Service');
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
        ? { name, email, password }
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
      {/* ═══ LEFT — Branding Hero ═══ */}
      <div className="login-left">
        <h1 className="left-hero-text">Plan your activities and control your<br/>progress online</h1>
        <div className="rocket-illustration-container">
          <div className="stars">
            <div className="star" style={{top: '10%', left: '30%'}}>✕</div>
            <div className="star" style={{top: '15%', left: '60%'}}>✕</div>
            <div className="star" style={{top: '40%', left: '75%'}}>✕</div>
            <div className="star" style={{top: '55%', left: '20%'}}>✕</div>
            <div className="star" style={{top: '50%', left: '80%'}}>✕</div>
            <div className="star" style={{top: '65%', left: '85%'}}>✕</div>
            <div className="star" style={{top: '30%', left: '15%'}}>✕</div>
          </div>
          <Rocket size={120} color="#fff" strokeWidth={1} className="rocket-icon" />
          <div className="rocket-clouds">
            <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" stroke="#fff" strokeWidth="1" d="M 20,70 Q 20,40 40,40 Q 50,20 70,20 Q 85,20 90,30 Q 100,5 130,5 Q 160,5 165,30 Q 180,30 185,50 Q 185,70 185,70 Z" />
              <path fill="none" stroke="#fff" strokeWidth="1" d="M 50,70 Q 50,50 70,50" opacity="0.5"/>
              <path fill="none" stroke="#fff" strokeWidth="1" d="M 120,70 Q 120,40 140,40" opacity="0.5"/>
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
      <div className="login-right">
        <div className="top-toggle-container">
          <div className="top-toggle">
             <button type="button" className={!isSignUp ? 'active' : ''} onClick={() => {setIsSignUp(false); resetForm();}}>Sign In</button>
             <button type="button" className={isSignUp ? 'active' : ''} onClick={() => {setIsSignUp(true); resetForm();}}>Sign Up</button>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-header">
            <h2>
              {/* If isSignUp is false, highlight Sign In, else highlight Sign Up */}
              <span className={!isSignUp ? "text-active underline" : "text-inactive"} onClick={() => {setIsSignUp(false); resetForm()}} style={{cursor: 'pointer'}}>Sign In</span>
              <span className="text-or"> or </span>
              <span className={isSignUp ? "text-active underline" : "text-inactive"} onClick={() => {setIsSignUp(true); resetForm()}} style={{cursor: 'pointer'}}>Sign Up</span>
            </h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            {isSignUp && (
              <div className="login-input-group">
                <label htmlFor="signup-name">FULL NAME</label>
                <div className="login-input-wrapper">
                  <input
                    id="signup-name"
                    type="text"
                    className="login-input"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="login-input-group">
                <label htmlFor="login-email">E MAIL</label>
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
            )}

            <div className="login-input-group">
              <label htmlFor="login-password">PASSWORD</label>
              <div className="login-input-wrapper">
                <input
                  id="login-password"
                  type="password"
                  className="login-input"
                  placeholder=".........."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="login-input-group">
                <label htmlFor="signup-email">E MAIL</label>
                <div className="login-input-wrapper">
                  <input
                    id="signup-email"
                    type="email"
                    className="login-input"
                    placeholder="Your email goes here"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <div className="login-checkbox-group">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>I agree all statements in <a href="#" className="terms-link">Terms of service</a></span>
                </label>
              </div>
            )}

            <div className="login-actions">
              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading && <span className="login-btn-spinner" />}
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
              
              {isSignUp ? (
                <a href="#" className="bottom-link" onClick={(e) => { e.preventDefault(); setIsSignUp(false); resetForm(); }}>
                  I'm already member
                </a>
              ) : (
                <a href="#" className="bottom-link" onClick={(e) => { e.preventDefault(); setIsSignUp(true); resetForm(); }}>
                  Create an account
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

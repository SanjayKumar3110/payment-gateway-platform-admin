import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import './Login.css'; // Reusing standard login styles

interface PassResetProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function PassReset({ onBack, onSuccess }: PassResetProps) {
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${baseUrl}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactInfo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');

      setStep(2);
      setCountdown(40);
      setCode(['', '', '', '']);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // limit to 1 char
    if (!/^\d*$/.test(value)) return; // only digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 4) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${baseUrl}/api/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactInfo, code: fullCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');

      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${baseUrl}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactInfo, code: code.join(''), newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    if (step === 1) {
      onBack();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="login-form-panel" style={{ position: 'relative' }}>
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          padding: '0',
          marginBottom: '24px',
          border: 'none',
          background: 'transparent',
          fontWeight: 500,
          color: '#666',
          cursor: 'pointer'
        }}
      >
        <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Back
      </button>

      {step === 1 && (
        <div className="login-step" style={{ textAlign: 'left' }}>
          <div className="login-header" style={{ marginBottom: '24px' }}>
            <h2 style={{ textAlign: 'left', marginBottom: '8px' }}>Forgot password</h2>
            <p style={{ textAlign: 'left', fontSize: '14px', color: '#666' }}>
              Enter the email associated with your account, and we will email you a verification code to reset your password.
            </p>
          </div>
          {error && <div className="login-error" style={{ marginBottom: '16px' }}>{error}</div>}
          <form className="login-form" onSubmit={handleEmailSubmit}>
            <div className="login-input-group">
              <div className="login-input-wrapper">
                <input
                  id="reset-contact"
                  type="text"
                  className="login-input"
                  placeholder="Email"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  style={{ paddingLeft: '16px' }}
                />
              </div>
            </div>
            <button type="submit" className="login-submit-btn" disabled={isLoading || !contactInfo} style={{ marginTop: '16px' }}>
              {isLoading ? <span className="login-btn-spinner" /> : 'Send code'}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="login-step" style={{ textAlign: 'left' }}>
          <div className="login-header" style={{ marginBottom: '24px' }}>
            <h2 style={{ textAlign: 'left', marginBottom: '8px' }}>Enter verification code</h2>
            <p style={{ textAlign: 'left', fontSize: '14px', color: '#666' }}>
              The verification code has been sent to email <br /><strong>{contactInfo}</strong>
            </p>
          </div>
          {error && <div className="login-error" style={{ marginBottom: '16px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                style={{
                  width: '56px',
                  height: '56px',
                  fontSize: '24px',
                  textAlign: 'center',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'transparent',
                  outline: 'none',
                  color: '#333'
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '14px', color: countdown > 0 ? '#666' : '#0070f3', cursor: countdown > 0 ? 'default' : 'pointer' }}>
            {countdown > 0 ? `Resend after ${countdown} seconds` : 'Resend code'}
          </p>
          {code.join('').length === 4 && (
            <button type="button" className="login-submit-btn" style={{ marginTop: '24px' }} disabled={isLoading} onClick={verifyCode}>
              {isLoading ? <span className="login-btn-spinner" /> : 'Verify'}
            </button>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="login-step" style={{ textAlign: 'left' }}>
          <div className="login-header" style={{ marginBottom: '24px' }}>
            <h2 style={{ textAlign: 'left', marginBottom: '8px' }}>Set password</h2>
            <p style={{ textAlign: 'left', fontSize: '14px', color: '#666' }}>
              Password requires a minimum of 8 characters and contains a capital letter, numbers and symbols
            </p>
          </div>
          {error && <div className="login-error" style={{ marginBottom: '16px' }}>{error}</div>}
          <form className="login-form" onSubmit={handlePasswordSubmit}>
            <div className="login-input-group">
              <div className="login-input-wrapper">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingLeft: '16px' }}
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
            <button type="submit" className="login-submit-btn" disabled={isLoading || newPassword.length < 8} style={{ marginTop: '16px' }}>
              {isLoading ? <span className="login-btn-spinner" /> : 'Continue'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

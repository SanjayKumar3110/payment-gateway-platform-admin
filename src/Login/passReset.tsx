import React, { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import './Login.css';

interface PassResetProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function PassReset({ onBack, onSuccess }: PassResetProps) {
  const [step, setStep] = useState(1); // 1: Business ID, 2: New Password
  const [email, setEmail] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Step 1: Verify the Business ID
  const handleBusinessIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !businessId) return;

    setIsLoading(true);
    setError('');

    try {
      // In a local environment, this endpoint checks if the ID exists
      const res = await fetch(`${baseUrl}/api/verify-business-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, businessId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid Business ID');

      // If ID is correct, move to password setting step
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Update the Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8 || newPassword !== confirmPassword) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${baseUrl}/api/reset-password-by-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, businessId, newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      onSuccess(); // Success! Redirect user
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
      setStep(1);
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

      {/* STEP 1: BUSINESS ID INPUT */}
      {step === 1 && (
        <div className="login-step" style={{ textAlign: 'left' }}>
          <div className="login-header" style={{ marginBottom: '24px' }}>
            <h2 style={{ textAlign: 'left', marginBottom: '8px' }}>Reset Password</h2>
            <p style={{ textAlign: 'left', fontSize: '14px', color: '#666' }}>
              Enter your Email and Business ID to authorize a password reset.
            </p>
          </div>

          {error && <div className="login-error" style={{ marginBottom: '16px' }}>{error}</div>}

          <form className="login-form" onSubmit={handleBusinessIdSubmit}>
            <div className="login-input-group">
              <div className="login-input-wrapper" style={{ marginBottom: '16px' }}>
                <input
                  id="email"
                  type="email"
                  className="login-input"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '16px' }}
                />
              </div>
              <div className="login-input-wrapper">
                <input
                  id="business-id"
                  type="text"
                  className="login-input"
                  placeholder="Business ID"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  style={{ paddingLeft: '16px' }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading || !businessId || !email}
              style={{ marginTop: '16px' }}
            >
              {isLoading ? <span className="login-btn-spinner" /> : 'Continue'}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: NEW PASSWORD INPUT */}
      {step === 2 && (
        <div className="login-step" style={{ textAlign: 'left' }}>
          <div className="login-header" style={{ marginBottom: '24px' }}>
            <h2 style={{ textAlign: 'left', marginBottom: '8px' }}>Set new password</h2>
            <p style={{ textAlign: 'left', fontSize: '14px', color: '#666' }}>
              Create a strong password for Business ID: <strong>{businessId}</strong>
            </p>
          </div>

          {error && <div className="login-error" style={{ marginBottom: '16px' }}>{error}</div>}

          <form className="login-form" onSubmit={handlePasswordSubmit}>
            <div className="login-input-group">
              <div className="login-input-wrapper" style={{ marginBottom: '16px' }}>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingLeft: '16px' }}
                />
                <div className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
              <div className="login-input-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '16px' }}
                />
                <div
                  className="input-icon-right"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              Minimum 8 characters required.
            </p>
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading || newPassword.length < 8 || confirmPassword.length < 8 || newPassword !== confirmPassword}
              style={{ marginTop: '16px' }}
            >
              {isLoading ? <span className="login-btn-spinner" /> : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
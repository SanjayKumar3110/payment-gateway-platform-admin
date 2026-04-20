import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Lock, CheckCircle, Download, ArrowRight, ArrowLeft, Building, ShieldCheck, FileText, Eye, EyeOff } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import './Login.css';

// PDF Document Styles
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#f8fafc' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  section: { marginBottom: 15, padding: 15, backgroundColor: '#ffffff', borderRadius: 8 },
  label: { fontSize: 10, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 14, color: '#1f2937', fontWeight: 'bold' },
  footer: { marginTop: 30, fontSize: 10, color: '#9ca3af', textAlign: 'center' }
});

const AccountDetailsPDF = ({ data, businessId }: { data: any, businessId: string }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.header}>Account Registration Details</Text>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Identity</Text>
        <Text style={pdfStyles.value}>{data.firstName} {data.lastName}</Text>
        <Text style={pdfStyles.value}>{data.email}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.label}>Business Profile</Text>
        <Text style={pdfStyles.value}>{data.companyName}</Text>
        <Text style={pdfStyles.value}>Type: {data.businessType}</Text>
        <Text style={pdfStyles.value}>Business ID: {businessId}</Text>
      </View>

      <Text style={pdfStyles.footer}>Store this document safely. This account is stored locally.</Text>
    </Page>
  </Document>
);

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onLoginSuccess: (email: string, token: string, user: any) => void;
}

export function SignupPage({ onSwitchToLogin, onLoginSuccess }: SignupPageProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    businessType: 'Retail',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [businessId, setBusinessId] = useState('');
  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const nextStep = () => {
    // Validate Step 1
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('Please fill in all identity fields.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
      }
    }
    // Validate Step 2
    if (step === 2) {
      if (!formData.companyName) {
        setError('Company Name is required.');
        return;
      }
    }
    // Validate Step 3
    if (step === 3) {
      if (!formData.password || formData.password !== formData.confirmPassword) {
        setError('Passwords do not match or are empty.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setDirection(1);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.acceptedTerms) return;

    setIsLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          businessName: formData.companyName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Automatically advance to Step 5 (Success State)
      setBusinessId(data.user.id);
      setDirection(1);
      setStep(5);

      // Store success data temporarily so we can pass it on clicking "Go to Dashboard"
      (window as any).__signupSuccessData = { email: formData.email, token: data.token, user: data.user };

    } catch (err) {
      console.error('Signup Error:', err);
      setError('Cannot connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    const d = (window as any).__signupSuccessData;
    if (d) {
      onLoginSuccess(d.email, d.token, d.user);
    }
  };

  const variants: any = {
    initial: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.3 } })
  };

  return (
    <div className="wizard-container">
      {/* Progress Indicators */}
      {step < 5 && (
        <div className="wizard-stepper">
          {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <div className={`step-circle ${step >= s ? 'active' : ''}`}>
                {s === 1 && <User size={16} />}
                {s === 2 && <Briefcase size={16} />}
                {s === 3 && <Lock size={16} />}
                {s === 4 && <CheckCircle size={16} />}
              </div>
              {s < 4 && <div className={`step-line ${step > s ? 'active' : ''}`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="wizard-content">
        {error && <div className="wizard-error">{error}</div>}

        <AnimatePresence mode="wait" custom={direction}>
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="wizard-step">
              <h2 className="wizard-title">Personal Identity</h2>
              <p className="wizard-subtitle">Let's get to know you better</p>

              <div className="wizard-grid-2">
                <div className="login-input-group">
                  <label>FIRST NAME</label>
                  <input type="text" className="login-input" placeholder="John" value={formData.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
                </div>
                <div className="login-input-group">
                  <label>LAST NAME</label>
                  <input type="text" className="login-input" placeholder="Doe" value={formData.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
                </div>
              </div>

              <div className="login-input-group" style={{ marginTop: '25px' }}>
                <label>EMAIL ADDRESS</label>
                <input type="email" className="login-input" placeholder="john.doe@example.com" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} />
              </div>

              <div className="wizard-actions">
                <button type="button" className="login-submit-btn ghost" onClick={onSwitchToLogin}>Back to Login</button>
                <button type="button" className="login-submit-btn" onClick={nextStep}>Next <ArrowRight size={16} /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: BUSINESS PROFILE */}
          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="wizard-step">
              <h2 className="wizard-title">Business Profile</h2>
              <p className="wizard-subtitle">Tell us about your organization</p>

              <div className="login-input-group">
                <label>COMPANY NAME</label>
                <div className="input-with-icon">
                  <Building size={16} className="input-icon" />
                  <input type="text" className="login-input pl-10" placeholder="Acme Corp" value={formData.companyName} onChange={(e) => updateForm('companyName', e.target.value)} />
                </div>
              </div>

              <div className="login-input-group" style={{ marginTop: '25px' }}>
                <label>BUSINESS TYPE</label>
                <select className="login-input select-styled" value={formData.businessType} onChange={(e) => updateForm('businessType', e.target.value)}>
                  <option>Retail</option>
                  <option>Service</option>
                  <option>E-commerce</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Business ID generation removed as per user request */}

              <div className="wizard-actions">
                <button type="button" className="login-submit-btn ghost" onClick={prevStep}><ArrowLeft size={16} /> Back</button>
                <button type="button" className="login-submit-btn" onClick={nextStep}>Next <ArrowRight size={16} /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SECURITY */}
          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="wizard-step">
              <h2 className="wizard-title">Security</h2>
              <p className="wizard-subtitle">Secure your local instance</p>

              <div className="login-input-group">
                <label>PASSWORD</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input type={showPassword ? "text" : "password"} className="login-input pl-10 pr-10" placeholder="••••••••" value={formData.password} onChange={(e) => updateForm('password', e.target.value)} />
                  <div className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>

              <div className="login-input-group" style={{ marginTop: '25px' }}>
                <label>CONFIRM PASSWORD</label>
                <div className="input-with-icon">
                  <ShieldCheck size={16} className="input-icon" />
                  <input type={showConfirmPassword ? "text" : "password"} className="login-input pl-10 pr-10" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} />
                  <div className="input-icon-right" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>

              <div className="security-warning">
                <strong>Important Note:</strong> This account is stored locally on this machine. We cannot recover lost passwords. Please ensure you keep it safe.
              </div>

              <div className="wizard-actions">
                <button type="button" className="login-submit-btn ghost" onClick={prevStep}><ArrowLeft size={16} /> Back</button>
                <button type="button" className="login-submit-btn" onClick={nextStep}>Next <ArrowRight size={16} /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW & LEGAL */}
          {step === 4 && (
            <motion.div key="step4" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="wizard-step">
              <h2 className="wizard-title">Review & Legal</h2>
              <p className="wizard-subtitle">Verify your details and accept terms</p>

              <div className="summary-box">
                <div className="summary-row"><span>Name:</span> <strong>{formData.firstName} {formData.lastName}</strong></div>
                <div className="summary-row"><span>Email:</span> <strong>{formData.email}</strong></div>
                <div className="summary-row"><span>Company:</span> <strong>{formData.companyName} ({formData.businessType})</strong></div>
              </div>

              <div className="login-input-group" style={{ marginTop: '20px' }}>
                <label>TERMS & CONDITIONS</label>
                <div className="terms-scroll-area">
                  <p><strong>1. Local Data Privacy</strong><br />All account information and transaction data are temporarily stored locally on this machine and processed immediately.</p>
                  <p><strong>2. No-Transaction Policy</strong><br />This platform acts strictly as a gateway terminal and does not retain funds. All risks associated with transactions are assumed by the user.</p>
                  <p><strong>3. Liability</strong><br />We are not liable for any lost data resulting from local device failure.</p>
                </div>
              </div>

              <div className="login-checkbox-group" style={{ marginTop: '15px' }}>
                <label className="login-remember">
                  <input type="checkbox" checked={formData.acceptedTerms} onChange={(e) => updateForm('acceptedTerms', e.target.value === 'on' ? !formData.acceptedTerms : true)} />
                  <span style={{ color: '#fff' }}>I accept the Terms and Conditions</span>
                </label>
              </div>

              <div className="wizard-actions">
                <button type="button" className="login-submit-btn ghost" onClick={prevStep} disabled={isLoading}><ArrowLeft size={16} /> Back</button>
                <button type="button" className="login-submit-btn success-btn" onClick={handleSubmit} disabled={!formData.acceptedTerms || isLoading}>
                  {isLoading ? <span className="login-btn-spinner" /> : 'Create Account'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS & DOWNLOAD */}
          {step === 5 && (
            <motion.div key="step5" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="wizard-step success-step">
              <div className="success-icon-wrapper">
                <CheckCircle size={64} className="text-success" />
              </div>
              <h2 className="wizard-title" style={{ textAlign: 'center' }}>Account Created!</h2>
              <p className="wizard-subtitle" style={{ textAlign: 'center' }}>Your business profile is ready.</p>

              <div className="download-card">
                <FileText size={48} className="text-primary" style={{ marginBottom: 15 }} />
                <PDFDownloadLink document={<AccountDetailsPDF data={formData} businessId={businessId} />} fileName="account-details.pdf" className="download-btn">
                  {({ loading }) => (loading ? 'Generating PDF...' : <><Download size={18} /> Download Account Details (PDF)</>)}
                </PDFDownloadLink>
              </div>

              <div className="wizard-actions" style={{ justifyContent: 'center', marginTop: '30px' }}>
                <button type="button" className="login-submit-btn" onClick={goToDashboard}>Proceed to Dashboard <ArrowRight size={16} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

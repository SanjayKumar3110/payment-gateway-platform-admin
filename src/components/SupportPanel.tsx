import { useState } from 'react';
import { Frown, Meh, Smile, ThumbsDown, ThumbsUp } from 'lucide-react';

export function SupportPanel({ darkMode }: { darkMode?: boolean }) {
  const [rating, setRating] = useState<number | null>(4);
  const [feedback, setFeedback] = useState('');
  const [contactMe, setContactMe] = useState(true);
  const [joinGroup, setJoinGroup] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Ratings mapped from 1-5 with default lucide-react icons
  const ratings = [
    { value: 1, label: 'Terrible', Icon: ThumbsDown },
    { value: 2, label: 'Bad', Icon: Frown },
    { value: 3, label: 'Okay', Icon: Meh },
    { value: 4, label: 'Good', Icon: Smile },
    { value: 5, label: 'Amazing', Icon: ThumbsUp },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    // Use mailto: scheme to trigger default email client with feedback details
    const supportEmail = "support@payplatform.test";
    const subject = encodeURIComponent("Platform Feedback: User Experience");

    let body = `Score: ${rating}/5\n`;
    body += `Rating: ${ratings.find(r => r.value === rating)?.label}\n`;
    body += `Reason:\n${feedback}\n\n`;
    body += `Contact me: ${contactMe ? 'Yes' : 'No'}\n`;
    body += `Join Research Group: ${joinGroup ? 'Yes' : 'No'}\n`;

    const bodyText = encodeURIComponent(body);

    // Simulate email opening
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${bodyText}`;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(4);
      setFeedback('');
    }, 4000);
  };

  return (
    <div className="feedback-container" style={{ padding: '10px', maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>

      {/* Background decoration matching reference picture */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', marginTop: '15px' }}>
        {/* <div style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          width: '100%',
          height: '100%',
          backgroundColor: darkMode ? 'rgba(244, 114, 182, 0.05)' : '#eef2fb',
          borderRadius: '24px',
          zIndex: 0
        }} /> */}

        <div style={{
          position: 'relative',
          backgroundColor: darkMode ? '#14141c' : '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: darkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.08)',
          border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.04)',
          zIndex: 1
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Smile size={64} color="#f472b6" style={{ marginBottom: '20px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>Thank you!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Your feedback client was just opened with your response.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Give feedback</h2>
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '32px', maxWidth: '400px', lineHeight: 1.5 }}>
                What do you think of the user experience within PayPlatform?
              </p>

              {/* Rating Selector */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                {ratings.map(({ value, label, Icon }) => {
                  const isSelected = rating === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '24px 8px',
                        backgroundColor: darkMode ? (isSelected ? 'rgba(244, 114, 182, 0.1)' : 'transparent') : (isSelected ? '#fff0f6' : '#ffffff'),
                        border: isSelected ? '2px solid #f472b6' : (darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb'),
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: isSelected ? '#f472b6' : 'var(--text-secondary)',
                        boxShadow: isSelected && !darkMode ? '0 4px 12px rgba(244, 114, 182, 0.2)' : 'none'
                      }}
                    >
                      <Icon size={32} strokeWidth={1.5} color={isSelected ? '#f472b6' : (darkMode ? '#a1a1aa' : '#64748b')} />
                      <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 500, color: isSelected ? '#f472b6' : 'var(--text-secondary)' }}>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Textarea */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  What are the main reasons for your rating?
                </label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '16px',
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : '#ffffff',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    resize: 'none',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f472b6';
                    if (!darkMode) e.target.style.boxShadow = '0 0 0 3px rgba(244, 114, 182, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={contactMe}
                    onChange={e => setContactMe(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#f472b6', cursor: 'pointer', borderRadius: '4px' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    I may be contacted about this feedback. <span style={{ color: '#f472b6', cursor: 'pointer' }}>Privacy Policy</span>
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={joinGroup}
                    onChange={e => setJoinGroup(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#f472b6', cursor: 'pointer', borderRadius: '4px' }}
                  />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    I'd like to help improve by joining the <span style={{ color: '#f472b6', cursor: 'pointer' }}>Research Group.</span>
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setRating(null);
                    setFeedback('');
                  }}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: darkMode ? 'transparent' : '#ffffff',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rating}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: '#f472b6',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: rating ? 'pointer' : 'not-allowed',
                    opacity: rating ? 1 : 0.5
                  }}
                >
                  Submit
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

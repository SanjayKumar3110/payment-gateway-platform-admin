import { useState } from 'react';
import { ThumbsDown, Frown, Meh, Smile, ThumbsUp } from 'lucide-react';

export function HelpFeedbackForm({ darkMode }: { darkMode?: boolean }) {
    const ratings = [
        { value: 1, label: 'Terrible', Icon: ThumbsDown },
        { value: 2, label: 'Bad', Icon: Frown },
        { value: 3, label: 'Okay', Icon: Meh },
        { value: 4, label: 'Good', Icon: Smile },
        { value: 5, label: 'Amazing', Icon: ThumbsUp },
    ];
    const [rating, setRating] = useState<number | null>(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [contactMe, setContactMe] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) return;
        const subject = encodeURIComponent('PayPlatform Feedback');
        let body = `Rating: ${rating}/5 (${ratings.find(r => r.value === rating)?.label})\n`;
        body += `Comments:\n${feedbackText}\n\nContact me: ${contactMe ? 'Yes' : 'No'}`;
        window.location.href = `mailto:dev@payplatform.in?subject=${subject}&body=${encodeURIComponent(body)}`;
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setRating(null); setFeedbackText(''); }, 4000);
    };
    return (
        <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Feedback</h3>
            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', margin: '0 0 20px 0' }} />
            <div style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Smile size={52} color="#8b5cf6" style={{ marginBottom: '16px' }} />
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Thank you!</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Your email client was opened with your feedback.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            What do you think of your experience with PayPlatform?
                        </p>

                        {/* Rating row */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                            {ratings.map(({ value, label, Icon }) => {
                                const sel = rating === value;
                                return (
                                    <button key={value} type="button" onClick={() => setRating(value)} style={{
                                        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                        padding: '16px 6px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s',
                                        background: sel ? 'rgba(139,92,246,0.1)' : 'transparent',
                                        border: sel ? '2px solid #8b5cf6' : '1px solid var(--border)',
                                        color: sel ? '#8b5cf6' : 'var(--text-secondary)'
                                    }}>
                                        <Icon size={28} strokeWidth={1.5} color={sel ? '#8b5cf6' : (darkMode ? '#a1a1aa' : '#64748b')} />
                                        <span style={{ fontSize: '11px', fontWeight: sel ? 700 : 500 }}>{label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Textarea */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                                What are the main reasons for your rating?
                            </label>
                            <textarea
                                value={feedbackText}
                                onChange={e => setFeedbackText(e.target.value)}
                                placeholder="Share your thoughts..."
                                style={{
                                    width: '100%', height: '96px', padding: '12px 14px', resize: 'none', outline: 'none',
                                    background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '8px',
                                    color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box'
                                }}
                                onFocus={e => { e.target.style.borderColor = '#8b5cf6'; }}
                                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                            />
                        </div>

                        {/* Checkbox */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '24px' }}>
                            <input type="checkbox" checked={contactMe} onChange={e => setContactMe(e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: '#8b5cf6', cursor: 'pointer' }} />
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>I may be contacted about this feedback.</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                style={{ width: '16px', height: '16px', accentColor: '#f472b6', cursor: 'pointer', borderRadius: '4px' }}
                            />
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                I'd like to help improve by joining the Research Group.
                            </span>
                        </label>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => { setRating(null); setFeedbackText(''); }}
                                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                                Clear
                            </button>
                            <button type="submit" disabled={!rating}
                                style={{ padding: '10px 24px', background: '#8b5cf6', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: rating ? 'pointer' : 'not-allowed', opacity: rating ? 1 : 0.5 }}>
                                Submit Feedback
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

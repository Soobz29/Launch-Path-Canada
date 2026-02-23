import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertTriangle, CheckCircle, ArrowRight, Check } from 'lucide-react';

const formStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'center',
  justifyContent: 'center', padding: '2rem 1rem',
  background: '#0F0F0F',
};

const cardStyle: React.CSSProperties = {
  background: '#141414', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 20, padding: '2.5rem', width: '100%', maxWidth: 440,
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 500,
  color: '#888', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.875rem 1rem',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, color: '#FAF7F2',
  fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem',
  outline: 'none', transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getStrength = (p: string) => {
    if (!p) return 'none';
    if (p.length < 8) return 'weak';
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return 'strong';
    return 'medium';
  };
  const strength = getStrength(password);
  const strengthColor = { none: '#333', weak: '#ef4444', medium: '#f59e0b', strong: '#22c55e' };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (data.user) setSuccess(true);
    } catch (err: any) { setError(err.message || 'Failed to create account.'); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div style={formStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={28} color="#22c55e" />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>Check your email</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            We sent a confirmation link to <strong style={{ color: '#FAF7F2' }}>{email}</strong>. Click it to activate your account.
          </p>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAF7F2', textDecoration: 'none', fontSize: '0.9rem' }}>
            Return to Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={formStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#C8102E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Get started</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>Create Account</h1>
        </div>

        {error && (
          <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.2)', borderRadius: 10, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={16} color="#C8102E" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: '#FAF7F2' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <div style={{ position: 'relative' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
              {email.includes('@') && email.includes('.') && (
                <Check size={16} color="#22c55e" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />
              )}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
            {password.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: 4, height: 3 }}>
                  {['weak', 'medium', 'strong'].map((level, i) => (
                    <div key={level} style={{ flex: 1, borderRadius: 2, background: ['weak','medium','strong'].indexOf(strength) >= i ? strengthColor[strength] : '#222', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.35rem' }}>
                  {strength === 'strong' ? 'Strong password' : strength === 'medium' ? 'Medium strength' : 'Weak — add numbers and capitals'}
                </p>
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              style={{ ...inputStyle, borderColor: confirmPassword && password !== confirmPassword ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)' }}
              required />
            {confirmPassword && password !== confirmPassword && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem' }}>Passwords do not match</p>
            )}
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.9rem', background: '#C8102E', color: 'white', border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}>
            {loading ? 'Creating account...' : <>Sign Up <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#555' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#C8102E', textDecoration: 'none', fontWeight: 500 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

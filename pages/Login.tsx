import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

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

const submitStyle: React.CSSProperties = {
  width: '100%', padding: '0.9rem',
  background: '#C8102E', color: 'white',
  border: 'none', borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.95rem', fontWeight: 500,
  cursor: 'pointer', transition: 'background 0.2s ease',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message?.includes('Invalid login') ? 'Incorrect email or password.' : err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email above first.'); return; }
    setLoading(true);
    try {
      const origin = window.location?.origin !== 'null' ? window.location.origin : 'https://launchpathcanada.ca';
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` });
      if (error) throw error;
      setResetSent(true); setError(null);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={formStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#C8102E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Welcome back</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>Log In</h1>
        </div>

        {error && (
          <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.2)', borderRadius: 10, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={16} color="#C8102E" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: '#FAF7F2' }}>{error}</span>
          </div>
        )}

        {resetSent && (
          <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, display: 'flex', gap: '0.75rem' }}>
            <CheckCircle size={16} color="#22c55e" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem', color: '#FAF7F2' }}>Reset link sent — check your inbox.</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
              <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#C8102E', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}>
                Forgot password?
              </button>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
          </div>
          <button type="submit" disabled={loading} style={{ ...submitStyle, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Logging in...' : <>Log In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#555' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#C8102E', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export { Login };
export default Login;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckIn, UserProfile } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, PlusCircle, AlertCircle, RefreshCw, Map, TrendingUp } from 'lucide-react';

const S = {
  page: { background: '#0F0F0F', minHeight: '100vh', color: '#FAF7F2', fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,
  container: { maxWidth: 1000, margin: '0 auto', padding: '3rem 1.5rem' } as React.CSSProperties,
  card: { background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.75rem' } as React.CSSProperties,
  label: { fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.35rem' },
  input: { width: '100%', padding: '0.75rem 0.875rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#FAF7F2', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const },
  primaryBtn: { display: 'inline-flex', alignItems: 'center' as const, gap: '0.4rem', padding: '0.6rem 1.25rem', background: '#C8102E', color: 'white', border: 'none', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' },
  outlineBtn: { display: 'inline-flex', alignItems: 'center' as const, gap: '0.4rem', padding: '0.6rem 1.25rem', background: 'transparent', color: '#FAF7F2', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.75rem 1rem' }}>
      <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>{new Date(label).toLocaleDateString()}</p>
      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#C8102E' }}>Score: {payload[0].value}</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); return; }
        setUser(session.user);

        const { data: profileData } = await supabase.from('users_profiles').select('*').eq('id', session.user.id).single();
        if (profileData) setProfile(profileData);

        const { data: checkinData, error: ci } = await supabase.from('checkins').select('*').eq('user_id', session.user.id).order('checkin_date', { ascending: true });
        if (ci) throw ci;
        if (checkinData) setCheckins(checkinData);
      } catch (err: any) {
        setPageError(err.message || 'Failed to load dashboard.');
      } finally { setLoading(false); }
    };
    init();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(score);
    if (isNaN(n) || n < 300 || n > 900) { setFormError('Score must be between 300 and 900.'); return; }
    setSubmitting(true); setFormError(null);
    try {
      const { data, error } = await supabase.from('checkins').insert({ user_id: user.id, score: n, checkin_date: date }).select().single();
      if (error) throw error;
      setCheckins(prev => [...prev, data].sort((a, b) => new Date(a.checkin_date).getTime() - new Date(b.checkin_date).getTime()));
      setShowForm(false); setScore('');
    } catch (err: any) { setFormError(err.message); }
    finally { setSubmitting(false); }
  };

  const latestScore = checkins.length > 0 ? checkins[checkins.length - 1].score : null;
  const firstScore = checkins.length > 1 ? checkins[0].score : null;
  const change = latestScore && firstScore ? latestScore - firstScore : null;

  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={28} color="#C8102E" />
    </div>
  );

  if (pageError) return (
    <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <AlertCircle size={36} color="#C8102E" style={{ marginBottom: '1rem' }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connection Error</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: 400 }}>{pageError}</p>
      <button onClick={() => window.location.reload()} style={S.primaryBtn}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.container}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#C8102E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Dashboard</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.1 }}>Welcome Back</h1>
            {profile?.visa_type && <p style={{ color: '#555', fontSize: '0.875rem', marginTop: '0.4rem' }}>{profile.visa_type}</p>}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/roadmap')} style={S.outlineBtn}><Map size={14} /> Roadmap</button>
            <button onClick={() => setShowForm(!showForm)} style={S.primaryBtn}><PlusCircle size={14} /> Log Score</button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Latest Score', value: latestScore ?? '—', highlight: true },
            { label: 'Total Change', value: change !== null ? `${change > 0 ? '+' : ''}${change}` : '—', highlight: false },
            { label: 'Check-ins', value: checkins.length, highlight: false },
            { label: 'Goal', value: profile?.credit_goal || '—', highlight: false },
          ].map(stat => (
            <div key={stat.label} style={S.card}>
              <p style={S.label}>{stat.label}</p>
              <p style={{ fontFamily: stat.highlight ? "'Playfair Display', serif" : "'DM Sans', sans-serif", fontSize: stat.highlight ? '2rem' : '1.2rem', fontWeight: 700, color: stat.highlight ? '#C8102E' : '#FAF7F2' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* LOG FORM */}
        {showForm && (
          <div style={{ ...S.card, marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Log New Score</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={S.label}>Score (300–900)</label>
                <input type="number" value={score} onChange={e => setScore(e.target.value)} style={S.input} placeholder="e.g. 650" />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={S.label}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={S.input} />
              </div>
              <button type="submit" disabled={submitting} style={{ ...S.primaryBtn, opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </form>
            {formError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.75rem' }}>{formError}</p>}
          </div>
        )}

        {/* CHART */}
        <div style={{ ...S.card, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={18} color="#C8102E" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700 }}>Score History</h2>
          </div>
          {checkins.length > 0 ? (
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={checkins}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="checkin_date" stroke="#444" tick={{ fill: '#555', fontSize: 11 }} tickFormatter={s => new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                  <YAxis domain={[300, 900]} stroke="#444" tick={{ fill: '#555', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#C8102E" strokeWidth={2.5} dot={{ r: 4, fill: '#0F0F0F', stroke: '#C8102E', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#C8102E' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <p style={{ color: '#444', marginBottom: '1rem', fontSize: '0.9rem' }}>No scores logged yet</p>
              <button onClick={() => setShowForm(true)} style={S.outlineBtn}>Log your first score</button>
            </div>
          )}
        </div>

        {/* PROFILE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={S.card}>
            <p style={S.label}>Bank Status</p>
            <p style={{ fontSize: '0.95rem', color: '#FAF7F2' }}>{profile?.bank_account_status || 'Not set'}</p>
          </div>
          <div style={S.card}>
            <p style={S.label}>Province</p>
            <p style={{ fontSize: '0.95rem', color: '#FAF7F2' }}>{profile?.province || 'Not set'}</p>
          </div>
          <div style={S.card}>
            <p style={S.label}>Income Bracket</p>
            <p style={{ fontSize: '0.95rem', color: '#FAF7F2' }}>{profile?.income_bracket || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

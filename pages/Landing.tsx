import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, ShieldCheck, CheckCircle2 } from 'lucide-react';

const S = {
  page: { background: '#0F0F0F', color: '#FAF7F2', fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,
  
  // HERO
  hero: { position: 'relative', padding: '8rem 1.5rem 7rem', textAlign: 'center', overflow: 'hidden' } as React.CSSProperties,
  heroBg: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,16,46,0.12) 0%, transparent 70%)', pointerEvents: 'none' } as React.CSSProperties,
  badge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', border: '1px solid rgba(200,16,46,0.3)', borderRadius: 100, fontSize: '0.75rem', fontWeight: 500, color: '#C8102E', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '2rem' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' },
  accent: { color: '#C8102E' },
  sub: { fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#888', maxWidth: 520, margin: '0 auto 3rem', lineHeight: 1.7 },
  cta: { display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.25rem', background: '#C8102E', color: 'white', borderRadius: 12, textDecoration: 'none', fontSize: '1rem', fontWeight: 500, transition: 'all 0.2s ease', border: 'none', cursor: 'pointer' },

  // STATS
  statsRow: { display: 'flex', justifyContent: 'center', gap: 'clamp(2rem, 6vw, 5rem)', padding: '3.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#C8102E', display: 'block' },
  statLabel: { fontSize: '0.75rem', color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginTop: '0.25rem' },

  // FEATURES
  features: { padding: '6rem 1.5rem', maxWidth: 1100, margin: '0 auto' },
  sectionLabel: { fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C8102E', marginBottom: '1rem' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: '3.5rem', lineHeight: 1.2 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' },
  card: { padding: '2rem', background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, transition: 'border-color 0.2s ease' },
  cardIcon: { width: 44, height: 44, borderRadius: 10, background: 'rgba(200,16,46,0.12)', border: '1px solid rgba(200,16,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem', color: '#FAF7F2' },
  cardText: { fontSize: '0.9rem', color: '#666', lineHeight: 1.7 },

  // HOW IT WORKS
  how: { padding: '5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', maxWidth: 800, margin: '0 auto' },
  steps: { display: 'flex', flexDirection: 'column' as const, gap: '0' },
  step: { display: 'flex', gap: '1.5rem', paddingBottom: '2.5rem', position: 'relative' as const },
  stepNum: { width: 36, height: 36, borderRadius: '50%', background: '#C8102E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 },
  stepTitle: { fontSize: '1rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.35rem' },
  stepText: { fontSize: '0.875rem', color: '#666', lineHeight: 1.6 },

  // CTA BANNER
  banner: { margin: '0 1.5rem 5rem', padding: '4rem 2rem', background: 'linear-gradient(135deg, #1a0508 0%, #0F0F0F 60%)', border: '1px solid rgba(200,16,46,0.2)', borderRadius: 20, textAlign: 'center' as const },
  bannerTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: '1rem' },
  bannerSub: { color: '#666', marginBottom: '2.5rem', maxWidth: 420, margin: '0 auto 2.5rem', lineHeight: 1.7 },
};

const Landing: React.FC = () => {
  return (
    <div style={S.page}>

      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroBg} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={S.badge}>
            <span>🇨🇦</span> Updated for {new Date().getFullYear()}
          </div>
          <h1 style={S.h1}>
            Build Canadian Credit<br />
            <span style={S.accent}>from Zero</span>
          </h1>
          <p style={S.sub}>
            A personalized month-by-month roadmap based on your visa type, income, and goals. Stop guessing and start building.
          </p>
          <Link to="/quiz" style={S.cta}>
            Get My Free Roadmap
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div style={S.statsRow}>
        {[
          { num: '400K+', label: 'Newcomers / Year' },
          { num: '6mo', label: 'Avg. Time to Score' },
          { num: '5', label: 'Quiz Questions' },
          { num: '100%', label: 'Free' },
        ].map(s => (
          <div key={s.num} style={{ textAlign: 'center' }}>
            <span style={S.statNum}>{s.num}</span>
            <span style={S.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section style={S.features}>
        <p style={S.sectionLabel}>Why it works</p>
        <h2 style={S.sectionTitle}>Built for your<br />exact situation</h2>
        <div style={S.grid}>
          {[
            { icon: <Map size={20} color="#C8102E" />, title: 'Visa-Specific Paths', text: 'Strategies differ if you are on a Study Permit, Work Permit, or PR. We give you the right advice for your status.' },
            { icon: <ShieldCheck size={20} color="#C8102E" />, title: 'Safe & Verified', text: 'No predatory lenders. We only recommend Tier 1 banks and secured cards regulated by the government.' },
            { icon: <CheckCircle2 size={20} color="#C8102E" />, title: 'Actionable Steps', text: 'Forget vague advice. Get a checklist of exactly which accounts to open and when to apply.' },
          ].map(f => (
            <div key={f.title} style={S.card}>
              <div style={S.cardIcon}>{f.icon}</div>
              <h3 style={S.cardTitle}>{f.title}</h3>
              <p style={S.cardText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ ...S.how, maxWidth: 800, margin: '0 auto' }}>
        <p style={{ ...S.sectionLabel, textAlign: 'center' }}>How it works</p>
        <h2 style={{ ...S.sectionTitle, textAlign: 'center' }}>Three steps to your roadmap</h2>
        <div style={S.steps}>
          {[
            { num: '1', title: 'Answer 5 questions', text: 'Tell us your visa status, province, income, and credit goal. Takes under 2 minutes.' },
            { num: '2', title: 'Get your roadmap', text: 'We generate a personalized month-by-month plan with specific Canadian products for your profile.' },
            { num: '3', title: 'Follow the checklist', text: 'Check off steps as you go. Log your credit score monthly to track your progress.' },
          ].map((step, i) => (
            <div key={step.num} style={S.step}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div style={S.stepNum}>{step.num}</div>
                {i < 2 && <div style={{ width: 1, flex: 1, background: 'rgba(200,16,46,0.2)', marginTop: '0.5rem' }} />}
              </div>
              <div style={{ paddingTop: '0.4rem' }}>
                <div style={S.stepTitle}>{step.title}</div>
                <div style={S.stepText}>{step.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div style={{ padding: '0 1.5rem 5rem' }}>
        <div style={S.banner}>
          <h2 style={S.bannerTitle}>Ready to start?</h2>
          <p style={{ color: '#666', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Your Canadian credit journey starts with 5 questions.
          </p>
          <Link to="/quiz" style={S.cta}>
            Take the Quiz
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;

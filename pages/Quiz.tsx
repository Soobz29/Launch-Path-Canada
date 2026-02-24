import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 1,
    question: 'What is your current status in Canada?',
    sub: 'This determines which credit products you\'re eligible for.',
    options: [
      { key: 'A', value: 'study_permit', label: 'Study Permit' },
      { key: 'B', value: 'work_permit', label: 'Work Permit (PGWP or Employer-Sponsored)' },
      { key: 'C', value: 'permanent_resident', label: 'Permanent Resident' },
      { key: 'D', value: 'citizen', label: 'Canadian Citizen' },
    ]
  },
  {
    id: 2,
    question: 'What is your monthly income in CAD?',
    sub: 'This determines which secured cards and loans you qualify for.',
    options: [
      { key: 'A', value: 'under_1000', label: 'Under $1,000' },
      { key: 'B', value: '1000_3000', label: '$1,000 – $3,000' },
      { key: 'C', value: '3000_5000', label: '$3,000 – $5,000' },
      { key: 'D', value: 'over_5000', label: '$5,000+' },
    ]
  },
  {
    id: 3,
    question: 'Do you have a Canadian bank account?',
    sub: 'Your first secured card needs to be linked to a Canadian account.',
    options: [
      { key: 'A', value: 'yes', label: 'Yes, I already have one' },
      { key: 'B', value: 'no', label: 'No, not yet' },
      { key: 'C', value: 'soon', label: 'I\'m opening one soon' },
    ]
  },
  {
    id: 4,
    question: 'What is your main credit goal?',
    sub: 'We\'ll prioritize the steps that matter most for this outcome.',
    options: [
      { key: 'A', value: 'apartment', label: 'Renting an apartment' },
      { key: 'B', value: 'car', label: 'Leasing or financing a car' },
      { key: 'C', value: 'credit_card', label: 'Getting a credit card with rewards' },
      { key: 'D', value: 'mortgage', label: 'Building credit for a future mortgage' },
    ]
  },
];

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const q = questions[current];
  const selected = answers[q.id];
  const isLast = current === questions.length - 1;

  const select = (value: string) => {
    setAnswers(prev => ({ ...prev, [q.id]: value }));
  };

  const advance = () => {
    if (!selected) return;
    if (isLast) {
      localStorage.setItem('quizAnswers', JSON.stringify(answers));
      navigate('/roadmap');
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  const pct = ((current) / questions.length) * 100;

  return (
    <div style={{ background: '#0F0F0F', minHeight: '100vh', color: '#FAF7F2', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#1a1a1a', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: '100%', background: '#C8102E', width: `${pct}%`, transition: 'width 0.5s ease' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 640, width: '100%' }}>

          <p style={{ fontSize: '0.75rem', color: '#C8102E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Step {current + 1} of {questions.length}
          </p>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.6rem' }}>
            {q.question}
          </h2>

          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>{q.sub}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {q.options.map(opt => (
              <div key={opt.value} onClick={() => select(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem',
                  border: `1px solid ${selected === opt.value ? '#C8102E' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 12,
                  background: selected === opt.value ? 'rgba(200,16,46,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700,
                  background: selected === opt.value ? '#C8102E' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selected === opt.value ? '#C8102E' : 'rgba(255,255,255,0.1)'}`,
                  color: selected === opt.value ? 'white' : '#666',
                  transition: 'all 0.2s ease',
                }}>
                  {opt.key}
                </span>
                <span style={{ fontSize: '0.95rem', color: '#FAF7F2' }}>{opt.label}</span>
              </div>
            ))}
          </div>

          <button onClick={advance} disabled={!selected}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.875rem 1.75rem',
              background: selected ? '#C8102E' : '#1a1a1a',
              color: selected ? 'white' : '#444',
              border: 'none', borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: 500,
              cursor: selected ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}>
            {isLast ? 'Generate My Roadmap' : 'Continue'}
            <span>→</span>
          </button>

          {current > 0 && (
            <button onClick={() => setCurrent(prev => prev - 1)}
              style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '1rem' }}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

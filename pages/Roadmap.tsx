import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QuizState, RoadmapType } from '../types';
import { generateRoadmapData } from '../utils/roadmapData';
import { CheckSquare, Square, Download, Save, Lock, Check, ChevronRight } from 'lucide-react';

const S = {
  page: { background: '#0F0F0F', minHeight: '100vh', color: '#FAF7F2', fontFamily: "'DM Sans', sans-serif", paddingBottom: '5rem' } as React.CSSProperties,
  container: { maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' } as React.CSSProperties,
};

const Roadmap: React.FC = () => {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapType>([]);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);
  const [celebration, setCelebration] = useState<{ show: boolean; month: number } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const monthRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [totalSteps, setTotalSteps] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('quizAnswers') || localStorage.getItem('quiz_answers');
    if (!stored) { navigate('/quiz'); return; }
    try {
      const parsed: QuizState = JSON.parse(stored);
      setQuizState(parsed);
      const generated = generateRoadmapData(parsed);
      setRoadmap(generated);
      setTotalSteps(generated.reduce((a, m) => a + m.actions.length, 0));
    } catch { navigate('/quiz'); return; }

    const fetchProgress = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data } = await supabase.from('checklist_progress').select('*').eq('user_id', session.user.id);
          if (data) {
            const p: Record<string, boolean> = {};
            data.forEach((r: any) => { if (r.completed) p[`m${r.month_number}-a${r.item_index + 1}`] = true; });
            setCompletedItems(p);
          }
        } else {
          const local = localStorage.getItem('roadmap_progress');
          if (local) setCompletedItems(JSON.parse(local));
        }
      } catch {
        const local = localStorage.getItem('roadmap_progress');
        if (local) setCompletedItems(JSON.parse(local) || {});
      }
    };
    fetchProgress();
  }, [navigate]);

  useEffect(() => {
    if (roadmap.length) {
      let c = 0;
      roadmap.forEach(m => m.actions.forEach(a => { if (completedItems[a.id]) c++; }));
      setCompletedCount(c);
    }
  }, [completedItems, roadmap]);

  useEffect(() => {
    if (celebration?.show) {
      setShowCelebration(true);
      const t = setTimeout(handleDismiss, 5000);
      return () => clearTimeout(t);
    } else setShowCelebration(false);
  }, [celebration]);

  const isComplete = (month: any, items: Record<string, boolean>) => month.actions.every((a: any) => items[a.id]);
  const isLocked = (idx: number) => idx !== 0 && !isComplete(roadmap[idx - 1], completedItems);

  const handleDismiss = () => {
    if (!celebration) return;
    const next = celebration.month + 1;
    setShowCelebration(false);
    setTimeout(() => {
      setCelebration(null);
      if (next <= 6) monthRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else navigate('/dashboard');
    }, 300);
  };

  const toggleItem = async (monthNum: number, actionIndex: number, actionId: string) => {
    if (isLocked(monthNum - 1)) return;
    const checked = !completedItems[actionId];
    const newP = { ...completedItems, [actionId]: checked };
    setCompletedItems(newP);

    if (user) {
      try {
        if (checked) await supabase.from('checklist_progress').insert({ user_id: user.id, month_number: monthNum, item_index: actionIndex, completed: true, completed_at: new Date() });
        else await supabase.from('checklist_progress').delete().eq('user_id', user.id).eq('month_number', monthNum).eq('item_index', actionIndex);
      } catch {}
    }
    localStorage.setItem('roadmap_progress', JSON.stringify(newP));

    if (checked) {
      const month = roadmap[monthNum - 1];
      if (!isComplete(month, completedItems) && isComplete(month, newP)) setCelebration({ show: true, month: monthNum });
    }
  };

  const celebrationText: Record<number, string> = {
    1: "Your foundation is set. Your credit journey has officially started.",
    2: "Your first credit account is open. This is the hardest step — you did it.",
    3: "You're building a payment history. Lenders are starting to see you.",
    4: "You now have a credit file at both bureaus. Big milestone.",
    5: "Two tradelines active. Your score is climbing.",
    6: "6 months done. Check your score — you've earned it.",
  };

  if (!quizState) return null;
  const pct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div style={S.page}>

      {/* NOT LOGGED IN BANNER */}
      {!user && (
        <div style={{ background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
          Progress is saved on this device only.{' '}
          <button onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: '#C8102E', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
            Create an account to save it permanently
          </button>
        </div>
      )}

      {/* STICKY PROGRESS */}
      <div style={{ position: 'sticky', top: 64, zIndex: 30, background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#666' }}>Progress</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#C8102E' }}>{completedCount} / {totalSteps} — {pct}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#C8102E', borderRadius: 2, width: `${pct}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>

      <div style={S.container}>
        <div style={{ padding: '2.5rem 0 2rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#C8102E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Plan</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.5rem' }}>
            6-Month Credit Roadmap
          </h1>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>Follow each step in sequence. Consistency is the only strategy that works.</p>
        </div>

        {/* MONTHS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {roadmap.map((month, idx) => {
            const locked = isLocked(idx);
            const done = isComplete(month, completedItems);
            const active = !locked && !done;

            return (
              <div key={month.monthNumber} ref={el => { monthRefs.current[month.monthNumber] = el; }}
                style={{
                  background: '#141414',
                  border: `1px solid ${done ? 'rgba(34,197,94,0.25)' : active ? 'rgba(200,16,46,0.35)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 16, overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: active ? '0 0 0 1px rgba(200,16,46,0.1)' : 'none',
                }}>

                {/* MONTH HEADER */}
                <div style={{
                  padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: done ? 'rgba(34,197,94,0.08)' : active ? 'rgba(200,16,46,0.08)' : 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: done ? 'rgba(34,197,94,0.2)' : active ? 'rgba(200,16,46,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: done ? '#22c55e' : active ? '#C8102E' : '#555' }}>
                      {done ? <Check size={14} /> : locked ? <Lock size={12} /> : month.monthNumber}
                    </div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: locked ? '#444' : '#FAF7F2' }}>
                      Month {month.monthNumber}
                    </span>
                    {active && <span style={{ fontSize: '0.7rem', color: '#C8102E', background: 'rgba(200,16,46,0.1)', padding: '0.2rem 0.6rem', borderRadius: 100, fontWeight: 600, letterSpacing: '0.05em' }}>ACTIVE</span>}
                  </div>
                  {done && <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600, letterSpacing: '0.08em' }}>COMPLETE</span>}
                </div>

                {/* MONTH CONTENT */}
                <div style={{ padding: '1.25rem 1.5rem', position: 'relative' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: locked ? '#333' : '#FAF7F2', filter: locked ? 'blur(5px)' : 'none', userSelect: locked ? 'none' : 'auto' }}>
                    {month.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', filter: locked ? 'blur(5px)' : 'none', pointerEvents: locked ? 'none' : 'auto', userSelect: locked ? 'none' : 'auto' }}>
                    {month.actions.map((action, i) => {
                      const checked = !!completedItems[action.id];
                      return (
                        <div key={action.id} onClick={() => toggleItem(month.monthNumber, i, action.id)}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', borderRadius: 10, cursor: locked ? 'not-allowed' : 'pointer', background: checked ? 'rgba(34,197,94,0.06)' : 'transparent', transition: 'background 0.2s' }}>
                          <div style={{ color: checked ? '#22c55e' : '#444', marginTop: 1, flexShrink: 0, transition: 'color 0.2s' }}>
                            {checked ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>
                          <span style={{ fontSize: '0.875rem', color: checked ? '#555' : '#CCC', textDecoration: checked ? 'line-through' : 'none', lineHeight: 1.6 }}>
                            {action.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* LOCK OVERLAY */}
                  {locked && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1.25rem 1.75rem', textAlign: 'center' }}>
                        <Lock size={20} color="#444" style={{ margin: '0 auto 0.5rem' }} />
                        <p style={{ fontSize: '0.8rem', color: '#555' }}>Complete Month {month.monthNumber - 1} to unlock</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTION ROW */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          {!user && (
            <button onClick={() => navigate('/signup')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: '#C8102E', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
              <Save size={15} /> Save Progress
            </button>
          )}
          <button onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: 'transparent', color: '#FAF7F2', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
            <Download size={15} /> Download PDF
          </button>
        </div>
      </div>

      {/* CELEBRATION OVERLAY */}
      {showCelebration && celebration && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,15,15,0.97)', backdropFilter: 'blur(8px)' }}>
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: 480 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Check size={36} color="#22c55e" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              Month {celebration.month} Complete
            </h2>
            <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              {celebrationText[celebration.month] || 'Step complete! Keep going.'}
            </p>
            <button onClick={handleDismiss} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: 10, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
              {celebration.month === 6 ? 'View Dashboard' : `Continue to Month ${celebration.month + 1}`}
              {celebration.month !== 6 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;

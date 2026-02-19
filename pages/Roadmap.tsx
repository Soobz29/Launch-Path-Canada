import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QuizState, RoadmapType } from '../types';
import { generateRoadmapData } from '../utils/roadmapData';
import Button from '../components/ui/Button';
import { 
  CheckSquare, 
  Square, 
  Download, 
  Save, 
  AlertTriangle, 
  Lock, 
  Check, 
  ChevronRight, 
  BellRing 
} from 'lucide-react';

const Roadmap: React.FC = () => {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapType>([]);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);
  
  // Celebration State
  const [celebration, setCelebration] = useState<{ show: boolean, month: number } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Refs for scrolling
  const monthRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Derived state for progress bar
  const [totalSteps, setTotalSteps] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Initial data load
  useEffect(() => {
    const storedAnswers = localStorage.getItem('quiz_answers');
    if (!storedAnswers) {
      navigate('/quiz');
      return;
    }

    try {
      const parsedAnswers: QuizState = JSON.parse(storedAnswers);
      setQuizState(parsedAnswers);
      const generatedRoadmap = generateRoadmapData(parsedAnswers);
      setRoadmap(generatedRoadmap);
      
      // Calculate total steps
      const total = generatedRoadmap.reduce((acc, month) => acc + month.actions.length, 0);
      setTotalSteps(total);

    } catch (error) {
      console.error('Failed to parse answers or generate roadmap:', error);
      navigate('/quiz');
      return;
    }

    const fetchUserAndProgress = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: checklistData } = await supabase
            .from('checklist_progress')
            .select('id, month_number, item_index, completed')
            .eq('user_id', session.user.id);
          
          if (checklistData) {
            const dbProgress: Record<string, boolean> = {};
            checklistData.forEach((row: any) => {
              const derivedId = `m${row.month_number}-a${row.item_index + 1}`;
              if (row.completed) dbProgress[derivedId] = true;
            });
            setCompletedItems(dbProgress);
          }
        } else {
           const localProgress = localStorage.getItem('roadmap_progress');
           if (localProgress) {
             setCompletedItems(JSON.parse(localProgress));
           }
        }
      } catch (err) {
        const localProgress = localStorage.getItem('roadmap_progress');
        if (localProgress) {
           setCompletedItems(JSON.parse(localProgress) || {});
        }
      }
    };

    fetchUserAndProgress();
  }, [navigate]);

  // Update progress count whenever completedItems changes
  useEffect(() => {
    if (roadmap.length > 0) {
      let count = 0;
      roadmap.forEach(month => {
        month.actions.forEach(action => {
          if (completedItems[action.id]) count++;
        });
      });
      setCompletedCount(count);
    }
  }, [completedItems, roadmap]);

  // Handle Celebration Overlay Timeout
  useEffect(() => {
    if (celebration?.show) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        handleDismissCelebration();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [celebration]);

  const isMonthComplete = (month: any, currentCompletedItems: Record<string, boolean>) => {
    return month.actions.every((action: any) => currentCompletedItems[action.id]);
  };

  const isMonthLocked = (monthIndex: number) => {
    if (monthIndex === 0) return false;
    // Locked if previous month is NOT complete
    const prevMonth = roadmap[monthIndex - 1];
    return !isMonthComplete(prevMonth, completedItems);
  };

  const handleDismissCelebration = () => {
    if (!celebration) return;
    
    const nextMonthNum = celebration.month + 1;
    setShowCelebration(false);
    setTimeout(() => {
        setCelebration(null);
        if (nextMonthNum <= 6) {
            monthRefs.current[nextMonthNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            navigate('/dashboard');
        }
    }, 300); // Wait for fade out
  };

  const toggleItem = async (monthNum: number, actionIndex: number, actionId: string) => {
    // Prevent toggling if month is locked
    const monthIndex = monthNum - 1;
    if (isMonthLocked(monthIndex)) return;

    const isNowChecked = !completedItems[actionId];
    const newProgress = { ...completedItems, [actionId]: isNowChecked };
    setCompletedItems(newProgress);

    // Save Logic
    if (user) {
      try {
        if (isNowChecked) {
            await supabase.from('checklist_progress').insert({
                user_id: user.id,
                month_number: monthNum,
                item_index: actionIndex,
                completed: true,
                completed_at: new Date()
            });
        } else {
            await supabase.from('checklist_progress')
                .delete()
                .eq('user_id', user.id)
                .eq('month_number', monthNum)
                .eq('item_index', actionIndex);
        }
      } catch (err) {
        console.error("Failed to sync progress", err);
      }
    }
    // Always save to local storage as backup
    localStorage.setItem('roadmap_progress', JSON.stringify(newProgress));

    // Check for Month Completion Celebration
    if (isNowChecked) {
        const month = roadmap[monthIndex];
        const wasComplete = isMonthComplete(month, completedItems);
        const isComplete = isMonthComplete(month, newProgress);

        if (!wasComplete && isComplete) {
            // Trigger celebration
            setCelebration({ show: true, month: monthNum });
            
            // If logged in, update profile for email reminders
            if (user && monthNum < 6) {
                try {
                    // We record that the NEXT month is now unlocked
                    await supabase.from('users_profiles').upsert({
                        id: user.id,
                        updated_at: new Date(),
                        // Assuming the column exists as requested in the prompt
                        next_month_unlocked_at: new Date().toISOString()
                    });
                } catch (e) {
                    console.warn("Could not update unlock timestamp", e);
                }
            }
        }
    }
  };

  const getCelebrationText = (monthNum: number) => {
    switch (monthNum) {
      case 1: return "Your foundation is set. Your credit journey has officially started.";
      case 2: return "Your first credit account is open. This is the hardest step — you did it.";
      case 3: return "You're building a payment history. Lenders are starting to see you.";
      case 4: return "You now have a credit file at both bureaus. Big milestone.";
      case 5: return "Two tradelines active. Your score is climbing.";
      case 6: return "6 months done. Check your score — you've earned it.";
      default: return "Step complete! Keep going.";
    }
  };

  if (!quizState) return null;

  const progressPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 relative">
      {/* Not Logged In Banner */}
      {!user && (
        <div className="bg-slate-900 text-white px-4 py-3 text-center text-sm md:flex md:justify-center md:items-center">
          <span className="mr-2">You are not logged in. Your progress is saved on this device only.</span>
          <button 
            onClick={() => navigate('/signup')} 
            className="underline font-bold hover:text-canada-red transition-colors ml-1"
          >
            Create an account to save it permanently.
          </button>
        </div>
      )}

      {/* Sticky Progress Header */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
           <div className="flex justify-between items-center mb-2">
             <span className="text-sm font-bold text-slate-700">Your Progress</span>
             <span className="text-sm font-bold text-canada-red">{completedCount} of {totalSteps} steps — {progressPercentage}%</span>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
             <div 
               className="bg-canada-red h-3 rounded-full transition-all duration-500 ease-out"
               style={{ width: `${progressPercentage}%` }}
             ></div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Your 6-Month Roadmap</h1>
            <p className="text-slate-600">
                Follow this plan step-by-step. Do not rush. Consistency is key.
            </p>
        </div>

        {/* Roadmap Cards */}
        <div className="space-y-8">
          {roadmap.map((month, index) => {
            const isLocked = isMonthLocked(index);
            const isComplete = isMonthComplete(month, completedItems);
            // Active if not locked and not complete
            const isActive = !isLocked && !isComplete;

            return (
              <div 
                key={month.monthNumber}
                ref={(el) => { monthRefs.current[month.monthNumber] = el; }}
                className={`
                    rounded-xl border transition-all duration-300 relative overflow-hidden
                    ${isLocked ? 'bg-slate-50 border-slate-200' : 'bg-white shadow-sm'}
                    ${isActive ? 'border-canada-red ring-1 ring-canada-red ring-opacity-50 shadow-md transform scale-[1.01]' : ''}
                    ${isComplete ? 'border-green-200' : ''}
                `}
              >
                {/* Header */}
                <div className={`
                    px-6 py-4 flex justify-between items-center transition-colors duration-300
                    ${isLocked ? 'bg-slate-100 text-slate-400' : ''}
                    ${isActive ? 'bg-slate-900 text-white' : ''}
                    ${isComplete ? 'bg-green-700 text-white' : ''}
                `}>
                    <div className="flex items-center">
                        <span className="font-bold text-lg mr-3">Month {month.monthNumber}</span>
                        {isLocked && <Lock className="h-5 w-5 opacity-70" />}
                    </div>
                    {isComplete && (
                        <div className="flex items-center bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase">
                            <Check className="h-3 w-3 mr-1" /> Done
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 relative">
                    <h3 className={`text-xl font-bold mb-4 transition-all duration-300 ${isLocked ? 'blur-md text-slate-400 select-none' : 'text-slate-800'}`}>
                        {month.title}
                    </h3>
                    
                    <div className={`space-y-3 transition-all duration-300 ${isLocked ? 'blur-md select-none pointer-events-none opacity-50' : ''}`}>
                        {month.actions.map((action, idx) => {
                            const isChecked = !!completedItems[action.id];
                            return (
                                <div 
                                    key={action.id}
                                    onClick={() => toggleItem(month.monthNumber, idx, action.id)}
                                    className={`
                                        flex items-start p-3 rounded-lg transition-all
                                        ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}
                                        ${isChecked ? 'bg-green-50' : ''}
                                    `}
                                >
                                    <div className={`mt-0.5 mr-3 flex-shrink-0 transition-colors ${
                                        isChecked ? 'text-green-600' : 'text-slate-300 group-hover:text-slate-400'
                                    }`}>
                                        {isChecked ? <CheckSquare className="h-6 w-6" /> : <Square className="h-6 w-6" />}
                                    </div>
                                    <span className={`text-base ${isChecked ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                        {action.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {isLocked && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center top-14">
                           <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center max-w-[80%]">
                              <div className="bg-slate-100 p-3 rounded-full mb-3">
                                <Lock className="h-6 w-6 text-slate-500" />
                              </div>
                              <h4 className="font-bold text-slate-800 mb-1">Step Locked</h4>
                              <p className="text-sm text-slate-500">
                                Complete Month {month.monthNumber - 1} to unlock this step.
                              </p>
                           </div>
                        </div>
                    )}
                </div>
                
                {isActive && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-canada-red/40 rounded-xl animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-12 mb-8 print:hidden">
          {!user && (
            <Button size="lg" onClick={() => navigate('/signup')} className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" /> Save My Progress
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={() => window.print()} className="w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
        
        {/* Email Note */}
        <div className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center">
           <BellRing className="h-3 w-3 mr-1" />
           Email reminders will be sent once email is configured.
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="text-center text-white px-4 max-w-lg">
                <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce-subtle">
                        <Check className="h-12 w-12 text-white stroke-[3]" />
                    </div>
                </div>
                <h2 className="text-4xl font-extrabold mb-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
                    Month {celebration.month} Complete! 🎉
                </h2>
                <p className="text-xl text-green-100 mb-8 leading-relaxed animate-in slide-in-from-bottom-4 duration-500 delay-200">
                    {getCelebrationText(celebration.month)}
                </p>
                <Button 
                    size="lg" 
                    onClick={handleDismissCelebration}
                    className="bg-white text-green-700 hover:bg-green-50 border-none text-lg px-8 py-6 shadow-xl animate-in slide-in-from-bottom-4 duration-500 delay-300"
                >
                    {celebration.month === 6 ? "Go to Dashboard" : `Continue to Month ${celebration.month + 1}`}
                    {celebration.month !== 6 && <ChevronRight className="ml-2 h-5 w-5" />}
                </Button>
            </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Roadmap;
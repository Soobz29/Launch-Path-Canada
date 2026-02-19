import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QuizState, RoadmapType } from '../types';
import { generateRoadmapData } from '../utils/roadmapData';
import Button from '../components/ui/Button';
import { CheckSquare, Square, Download, Save, AlertTriangle } from 'lucide-react';

const Roadmap: React.FC = () => {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapType>([]);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<any>(null);
  const [checkinScore, setCheckinScore] = useState('');
  const [checkinDate, setCheckinDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCheckinSubmitting, setIsCheckinSubmitting] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    // 1. Get Quiz Data Safely (Step 4)
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
    } catch (error) {
      console.error('Failed to parse answers or generate roadmap:', error);
      navigate('/quiz');
      return;
    }

    // 2. Get User & Progress
    const fetchUserAndProgress = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch progress from DB
          const { data: checklistData, error: dbError } = await supabase
            .from('checklist_progress')
            .select('id, month_number, item_index, completed')
            .eq('user_id', session.user.id);
          
          if (dbError) throw dbError;
          
          if (checklistData) {
            const dbProgress: Record<string, boolean> = {};
            checklistData.forEach((row: any) => {
              const derivedId = `m${row.month_number}-a${row.item_index + 1}`;
              if (row.completed) dbProgress[derivedId] = true;
            });
            setCompletedItems(dbProgress);
          }
        } else {
           // Fallback to LocalStorage if not logged in
           // (Usually handled by catch block, but explicit check here for clarity)
           const localProgress = localStorage.getItem('roadmap_progress');
           if (localProgress) {
             setCompletedItems(JSON.parse(localProgress));
           }
        }
      } catch (err) {
        // Fallback to LocalStorage on error (NetworkError or No Session)
        const localProgress = localStorage.getItem('roadmap_progress');
        if (localProgress) {
          try {
             setCompletedItems(JSON.parse(localProgress));
          } catch (e) {
             console.error("Failed to parse local progress");
          }
        }
      }
    };

    fetchUserAndProgress();
  }, [navigate]);

  const toggleItem = async (monthNum: number, actionIndex: number, actionId: string) => {
    const isCompleted = !completedItems[actionId];
    
    // Optimistic Update
    const newProgress = { ...completedItems, [actionId]: isCompleted };
    setCompletedItems(newProgress);

    if (user) {
      // Sync to DB
      try {
        if (isCompleted) {
            await supabase.from('checklist_progress').insert({
                user_id: user.id,
                month_number: monthNum,
                item_index: actionIndex,
                completed: true,
                completed_at: new Date()
            });
        } else {
            // Delete the row if unchecked
            await supabase.from('checklist_progress')
                .delete()
                .eq('user_id', user.id)
                .eq('month_number', monthNum)
                .eq('item_index', actionIndex);
        }
      } catch (err) {
        console.error("Failed to sync progress", err);
        // Save to local storage as backup if network fails
        localStorage.setItem('roadmap_progress', JSON.stringify(newProgress));
      }
    } else {
      // Sync to LocalStorage
      localStorage.setItem('roadmap_progress', JSON.stringify(newProgress));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveProgress = () => {
    if (!user) {
      navigate('/signup', { state: { message: "Create a free account to save your roadmap." } });
    }
  };

  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinMessage(null);

    if (!user) {
      setCheckinMessage({ type: 'error', text: 'You must be logged in to save check-ins.' });
      return;
    }

    const scoreNum = parseInt(checkinScore);
    if (isNaN(scoreNum) || scoreNum < 300 || scoreNum > 900) {
      setCheckinMessage({ type: 'error', text: 'Please enter a valid credit score (300-900).' });
      return;
    }

    setIsCheckinSubmitting(true);
    try {
      const { error } = await supabase.from('checkins').insert({
        user_id: user.id,
        score: scoreNum,
        checkin_date: checkinDate,
      });

      if (error) throw error;
      setCheckinMessage({ type: 'success', text: 'Score saved successfully!' });
      setCheckinScore('');
    } catch (err: any) {
      setCheckinMessage({ type: 'error', text: err.message || "Failed to save score. Please try again." });
    } finally {
      setIsCheckinSubmitting(false);
    }
  };

  if (!quizState) return null; // Or a loading spinner

  // Summary Logic
  let estimatedRange = "650 - 680";
  let timeToGoal = "6 Months";
  if (quizState.status.includes("Permanent")) estimatedRange = "680 - 720";
  if (quizState.status.includes("Study")) estimatedRange = "640 - 660";

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-10">
          <h1 className="text-3xl font-bold mb-6 text-slate-900">Your Personalized Roadmap</h1>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 rounded-xl p-5 border border-red-100">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">Status Detected</span>
              <span className="text-lg font-bold text-slate-900">{quizState.status}</span>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">Target Score Range</span>
              <span className="text-lg font-bold text-slate-900">{estimatedRange}</span>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <span className="text-xs font-bold uppercase tracking-wider text-green-600 block mb-1">Timeline</span>
              <span className="text-lg font-bold text-slate-900">{timeToGoal}</span>
            </div>
          </div>
          
          {/* Default roadmap warning if logic fell through to default */}
          {!quizState.status.includes("Study") && !quizState.status.includes("Work") && !quizState.status.includes("Permanent") && !quizState.status.includes("Citizen") && (
             <div className="mt-4 flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg text-sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                This plan is a general starting point. Your specific situation may allow faster progress.
             </div>
          )}
        </div>

        {/* Roadmap Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {roadmap.map((month) => (
            <div key={month.monthNumber} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center">
                <span className="font-bold">Month {month.monthNumber}</span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-4 text-slate-800 leading-tight">{month.title}</h3>
                <div className="space-y-3 mt-auto">
                  {month.actions.map((action, idx) => {
                    const isChecked = !!completedItems[action.id];
                    return (
                      <div 
                        key={action.id} 
                        className={`flex items-start p-2 rounded-lg transition-colors cursor-pointer ${isChecked ? 'bg-green-50' : 'hover:bg-slate-50'}`}
                        onClick={() => toggleItem(month.monthNumber, idx, action.id)}
                      >
                        <div className={`mt-0.5 mr-3 flex-shrink-0 ${isChecked ? 'text-green-600' : 'text-slate-300'}`}>
                          {isChecked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                        </div>
                        <span className={`text-sm ${isChecked ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                          {action.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16 print:hidden">
          {!user && (
            <Button size="lg" onClick={handleSaveProgress} className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" /> Save My Progress
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={handlePrint} className="w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>

        {/* Monthly Check-in */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 print:hidden">
          <h2 className="text-2xl font-bold mb-4">Monthly Check-in</h2>
          <p className="text-slate-600 mb-6">Track your score as you go. We'll graph it on your dashboard.</p>
          
          <form onSubmit={handleCheckinSubmit} className="flex flex-col md:flex-row gap-4 items-end">
             <div className="w-full md:w-1/3">
               <label className="block text-sm font-medium text-slate-700 mb-1">Current Credit Score</label>
               <input 
                 type="number" 
                 min="300" max="900" 
                 placeholder="e.g. 650"
                 value={checkinScore}
                 onChange={(e) => setCheckinScore(e.target.value)}
                 className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-2 focus:ring-canada-red outline-none"
                 required
               />
             </div>
             <div className="w-full md:w-1/3">
               <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
               <input 
                 type="date" 
                 value={checkinDate}
                 onChange={(e) => setCheckinDate(e.target.value)}
                 className="w-full p-2.5 rounded-md border border-slate-300 focus:ring-2 focus:ring-canada-red outline-none"
                 required
               />
             </div>
             <div className="w-full md:w-auto">
               <Button type="submit" isLoading={isCheckinSubmitting} className="w-full">
                 Log Score
               </Button>
             </div>
          </form>
          {checkinMessage && (
            <div className={`mt-4 text-sm font-medium ${checkinMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {checkinMessage.text}
            </div>
          )}
          {!user && (
            <p className="mt-4 text-xs text-slate-500">
              <Save className="inline h-3 w-3 mr-1" />
              Create an account to save your history permanently.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Roadmap;
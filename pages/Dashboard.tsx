import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckIn, UserProfile } from '../types';
import Button from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  
  // Form state
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (!session) {
          navigate('/login');
          return;
        }
        setUser(session.user);
        
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('users_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
             // Ignore 'row not found', but throw others
             console.warn("Profile fetch warning", profileError);
        }
        if (profileData) setProfile(profileData);

        // Fetch Checkins
        const { data: checkinData, error: checkinError } = await supabase
          .from('checkins')
          .select('*')
          .eq('user_id', session.user.id)
          .order('checkin_date', { ascending: true });

        if (checkinError) throw checkinError;
        if (checkinData) setCheckins(checkinData);

      } catch (err: any) {
        console.error("Error loading dashboard data:", err);
        setPageError(err.message || "Failed to connect to the database. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleSubmitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 300 || scoreNum > 900) {
      setFormError("Score must be between 300 and 900.");
      setSubmitting(false);
      return;
    }

    try {
      const { data, error: apiError } = await supabase
        .from('checkins')
        .insert({
          user_id: user.id,
          score: scoreNum,
          checkin_date: date
        })
        .select()
        .single();

      if (apiError) throw apiError;

      setCheckins([...checkins, data].sort((a, b) => new Date(a.checkin_date).getTime() - new Date(b.checkin_date).getTime()));
      setShowCheckinForm(false);
      setScore('');
    } catch (err: any) {
      setFormError(err.message || "Failed to save check-in.");
    } finally {
      setSubmitting(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-sm text-slate-500 mb-1">{new Date(label).toLocaleDateString()}</p>
          <p className="text-sm font-bold text-canada-red">
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-canada-red" />
      </div>
    );
  }

  if (pageError) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
              <p className="text-slate-600 mb-6 max-w-md">{pageError}</p>
              <Button onClick={() => window.location.reload()}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Retry
              </Button>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-600">Tracking progress for: <span className="font-semibold text-slate-800">{profile?.visa_type || "User"}</span></p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/roadmap')}>View Roadmap</Button>
          <Button onClick={() => setShowCheckinForm(!showCheckinForm)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Log Score
          </Button>
        </div>
      </div>

      {/* Checkin Form Modal/Inline */}
      {showCheckinForm && (
        <div className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4">Log New Score</h3>
          <form onSubmit={handleSubmitCheckin} className="flex flex-col md:flex-row gap-4 items-end">
             <div className="w-full md:w-1/3">
               <label className="block text-sm font-medium text-slate-700 mb-1">Score</label>
               <input 
                 type="number" 
                 value={score}
                 onChange={(e) => setScore(e.target.value)}
                 className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-canada-red outline-none"
                 placeholder="300-900"
               />
             </div>
             <div className="w-full md:w-1/3">
               <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
               <input 
                 type="date" 
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-canada-red outline-none"
               />
             </div>
             <Button type="submit" isLoading={submitting}>Save</Button>
          </form>
          {formError && (
            <div className="mt-3 text-red-600 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" /> {formError}
            </div>
          )}
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
        <h2 className="text-xl font-bold mb-6">Score History</h2>
        {checkins.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={checkins}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="checkin_date" 
                  stroke="#64748b" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day:'numeric'})}
                />
                <YAxis domain={[300, 900]} stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#FF0000" 
                  strokeWidth={3} 
                  activeDot={{ r: 8 }} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="mb-4">No data yet.</p>
            <Button variant="outline" onClick={() => setShowCheckinForm(true)}>Log your first credit score</Button>
          </div>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-2">My Goal</h3>
             <p className="text-slate-600">{profile?.credit_goal || "Not set"}</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-2">My Bank Status</h3>
             <p className="text-slate-600">{profile?.bank_account_status || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
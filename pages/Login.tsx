import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // If user came from a protected route, or roadmap save click
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (!email.includes('@')) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Sync local roadmap data to DB if logging in for first time?
      // For now, simpler: just redirect.
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.message.includes("Invalid login")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setLoading(true);
    try {
        // Safe origin check for sandboxed environments
        let origin = 'https://launchpathcanada.com';
        if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
           origin = window.location.origin;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: origin + '/reset-password', 
        });
        if (error) throw error;
        setResetSent(true);
        setError(null);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Log In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
             <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Password reset email sent. Check your inbox.</span>
             </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-canada-red outline-none"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-xs text-canada-red hover:underline">
                    Forgot password?
                </button>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-canada-red outline-none"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
          </div>

          <Button type="submit" isLoading={loading} className="w-full h-12">
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-canada-red font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import { AlertTriangle, Check, CheckCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Message passed from Roadmap page ("Create account to save...")
  const message = location.state?.message;

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 'none';
    if (pass.length < 8) return 'weak';
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.length >= 8) return 'strong';
    return 'medium';
  };

  const strength = getPasswordStrength(password);
  const strengthColor = {
    none: 'bg-slate-200',
    weak: 'bg-red-400',
    medium: 'bg-yellow-400',
    strong: 'bg-green-500'
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        setSuccess(true);
      }

    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Check your email</h2>
            <p className="text-slate-600 mb-8">
                We've sent a confirmation link to <strong>{email}</strong>. Please click the link to activate your account.
            </p>
            <Button to="/login" variant="outline" className="w-full">Return to Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center text-slate-900">Create Account</h2>
        {message && <p className="text-center text-canada-red text-sm mb-6">{message}</p>}
        {!message && <p className="text-center text-slate-500 text-sm mb-6">Start your credit journey today</p>}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-canada-red outline-none"
                required
                />
                {email.includes('@') && email.includes('.') && (
                    <Check className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
                )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-canada-red outline-none"
              required
            />
            {password.length > 0 && (
                <div className="mt-2 flex gap-1 h-1">
                    <div className={`flex-1 rounded-full ${strength === 'weak' || strength === 'medium' || strength === 'strong' ? strengthColor[strength] : 'bg-slate-200'}`}></div>
                    <div className={`flex-1 rounded-full ${strength === 'medium' || strength === 'strong' ? strengthColor[strength] : 'bg-slate-200'}`}></div>
                    <div className={`flex-1 rounded-full ${strength === 'strong' ? strengthColor[strength] : 'bg-slate-200'}`}></div>
                </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
                {strength === 'strong' ? 'Strong password' : strength === 'medium' ? 'Medium strength' : strength === 'weak' ? 'Weak password' : 'At least 8 characters'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border focus:ring-2 outline-none ${confirmPassword && password !== confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-canada-red'}`}
              required
            />
            {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <Button type="submit" isLoading={loading} className="w-full h-12">
            Sign Up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-canada-red font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
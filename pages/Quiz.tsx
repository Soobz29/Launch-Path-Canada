import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { QuizState } from '../types';
import { supabase } from '../lib/supabase';
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

const steps = [
  {
    id: 'status',
    question: "What is your current status in Canada?",
    options: [
      "Study Permit",
      "Work Permit (PGWP or Employer-Sponsored)",
      "Permanent Resident",
      "Canadian Citizen"
    ]
  },
  {
    id: 'province',
    question: "Which province are you in?",
    type: 'select',
    options: [
      "Ontario", "British Columbia", "Alberta", "Quebec", "Manitoba", "Saskatchewan", 
      "Nova Scotia", "New Brunswick", "Newfoundland", "PEI", "Yukon", "NWT", "Nunavut"
    ]
  },
  {
    id: 'income',
    question: "What is your monthly income in CAD?",
    options: [
      "Under $1,000",
      "$1,000 – $3,000",
      "$3,000 – $5,000",
      "$5,000+"
    ]
  },
  {
    id: 'bankAccount',
    question: "Do you have a Canadian bank account?",
    options: [
      "Yes, I already have one",
      "No, not yet",
      "I'm opening one soon"
    ]
  },
  {
    id: 'goal',
    question: "What is your main credit goal?",
    options: [
      "Renting an apartment",
      "Leasing or financing a car",
      "Getting a credit card with rewards",
      "Building credit for a future mortgage"
    ]
  }
];

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizState>({
    status: '',
    province: '',
    income: '',
    bankAccount: '',
    goal: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Retrieve current answer key safely
  const currentKey = currentQuestion.id as keyof QuizState;
  const currentAnswer = answers[currentKey];

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentKey]: value }));
  };

  const handleNext = async () => {
    if (!currentAnswer) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step
      setIsLoading(true);
      setError(null);

      try {
        // Simulating processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Save to Supabase if logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { error: dbError } = await supabase
            .from('users_profiles')
            .upsert({
              id: session.user.id,
              visa_type: answers.status,
              province: answers.province,
              income_bracket: answers.income,
              bank_account_status: answers.bankAccount,
              credit_goal: answers.goal,
              updated_at: new Date()
            });
            
          if (dbError) throw dbError;
        }

        // Save to LocalStorage (always, as fallback and for Roadmap page to read immediately)
        localStorage.setItem('quiz_answers', JSON.stringify(answers));

        navigate('/roadmap');
      } catch (err: any) {
        console.error(err);
        setError("Failed to generate roadmap. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="bg-canada-red h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">{currentQuestion.question}</h2>

        {/* Form Inputs */}
        <div className="flex-1 space-y-3">
          {currentQuestion.type === 'select' ? (
             <select
               value={currentAnswer}
               onChange={(e) => handleSelect(e.target.value)}
               className="w-full p-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-canada-red focus:border-transparent outline-none transition-shadow"
             >
               <option value="" disabled>Select your province</option>
               {currentQuestion.options.map(opt => (
                 <option key={opt} value={opt}>{opt}</option>
               ))}
             </select>
          ) : (
            currentQuestion.options.map(opt => (
              <label 
                key={opt}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                  currentAnswer === opt 
                    ? 'border-canada-red bg-red-50 text-canada-red ring-1 ring-canada-red' 
                    : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <input 
                  type="radio" 
                  name={currentQuestion.id} 
                  value={opt} 
                  checked={currentAnswer === opt}
                  onChange={() => handleSelect(opt)}
                  className="h-5 w-5 text-canada-red border-slate-300 focus:ring-canada-red"
                />
                <span className="ml-3 font-medium">{opt}</span>
              </label>
            ))
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 0 || isLoading}
            className={currentStep === 0 ? "invisible" : ""}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          
          <div className={shake ? 'animate-shake' : ''}>
            <Button 
              onClick={handleNext} 
              isLoading={isLoading}
              disabled={!currentAnswer && !isLoading}
              className="px-8"
            >
              {currentStep === steps.length - 1 ? "Generate My Roadmap" : "Next"}
              {currentStep !== steps.length - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Inline styles for shake animation because tailwind default doesn't have it exactly like this */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default Quiz;
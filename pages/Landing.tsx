import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowRight, CheckCircle2, Map, ShieldCheck } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-50 via-white to-white opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-800 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-red-600 mr-2"></span>
            Updated for {new Date().getFullYear()} Immigration Rules
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Build Canadian Credit <span className="text-canada-red">from Zero</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            A personalized month-by-month roadmap based on your visa type, income, and goals. Stop guessing and start building.
          </p>
          <Button to="/quiz" size="lg" className="shadow-xl shadow-red-500/20 hover:shadow-red-500/30 transition-all transform hover:-translate-y-1">
             Get My Free Roadmap <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-red-100 text-canada-red rounded-xl flex items-center justify-center mb-4">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visa-Specific Paths</h3>
              <p className="text-slate-600">Strategies differ if you are on a Study Permit, Work Permit, or PR. We give you the right advice for your status.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Safe & Verified</h3>
              <p className="text-slate-600">No predatory lenders. We only recommend Tier 1 banks and trusted secured cards regulated by the government.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Actionable Steps</h3>
              <p className="text-slate-600">Forget vague advice. Get a checklist of exactly which accounts to open and when to apply.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
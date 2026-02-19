import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check active session safely
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (err) {
        // Silently fail on network error and assume logged out to prevent app crash
        console.warn("Auth check failed:", err);
        setUser(null);
      }
    };
    
    checkSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem('quiz_answers');
    localStorage.removeItem('roadmap_progress');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-canada-red">
            <Rocket className="h-6 w-6" />
            <span>Launch Path Canada</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-canada-red transition-colors">
                  Dashboard
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-canada-red transition-colors">
                  Log In
                </Link>
                <Button to="/quiz">Get Started</Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white p-4 space-y-4 shadow-lg">
            {user ? (
              <>
                <Link to="/dashboard" className="block text-sm font-medium py-2">
                  Dashboard
                </Link>
                <Button variant="outline" onClick={handleLogout} className="w-full">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-sm font-medium py-2">
                  Log In
                </Link>
                <Button to="/quiz" className="w-full">Get Started</Button>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Launch Path Canada. Not affiliated with any bank or government agency.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
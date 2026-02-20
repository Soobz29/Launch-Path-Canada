import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
<BrowserRouter>
  <Layout>
    <Routes> ... </Routes>
  </Layout>
</BrowserRouter>
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Quiz from './pages/Quiz';
import Roadmap from './pages/Roadmap';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

// 404 Component
const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
    <p className="text-xl text-slate-600 mb-8">Page not found.</p>
    <a href="/" className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Go Home</a>
  </div>
);

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </MemoryRouter>
  );
};

export default App;

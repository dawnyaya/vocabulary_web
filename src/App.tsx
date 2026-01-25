import { FC, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AddWordPage } from './pages/AddWordPage';
import { ReviewPage } from './pages/ReviewPage';
import { loadVoices } from './services/textToSpeech';

const Navigation: FC = () => {
  const location = useLocation();

  // Don't show navigation on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-white/60 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-2xl font-bold text-charcoal tracking-tight"
            >
              Memoloop
            </Link>
            <div className="flex gap-2">
              <Link
                to="/add"
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname === '/add'
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'text-gray-600 hover:bg-gray-100/60'
                }`}
              >
                Add Word
              </Link>
              <Link
                to="/review"
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname === '/review'
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'text-gray-600 hover:bg-gray-100/60'
                }`}
              >
                Review
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: FC = () => {
  useEffect(() => {
    // Load speech synthesis voices on app start
    loadVoices();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-off-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddWordPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

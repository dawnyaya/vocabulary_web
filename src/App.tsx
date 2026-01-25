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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900"
            >
              Vocabulary
            </Link>
            <div className="flex gap-4">
              <Link
                to="/add"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/add'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Word
              </Link>
              <Link
                to="/review"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/review'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
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
      <div className="min-h-screen bg-white">
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

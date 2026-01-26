import { FC, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AddWordPage } from './pages/AddWordPage';
import { ReviewPage } from './pages/ReviewPage';
import { LoginPage } from './pages/LoginPage';
import { CollectionPage } from './pages/CollectionPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { signOut } from './services/auth';
import { loadVoices } from './services/textToSpeech';

const Navigation: FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isHomePage = location.pathname === '/';
  const isCollectionsPage = location.pathname.startsWith('/collection');
  const showPageToggle = isHomePage || isCollectionsPage;

  return (
    <nav className="bg-white/60 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-2xl font-bold text-charcoal tracking-tight"
            >
              Memoloop
            </Link>

            {/* Dashboard / Collection Toggle - Only show on home and collection pages */}
            {showPageToggle && (
              <div className="hidden md:flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1">
                <Link
                  to="/"
                  className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isHomePage
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/collections"
                  className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isCollectionsPage
                      ? 'bg-white text-charcoal shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Collections
                </Link>
              </div>
            )}

            {/* Add/Review buttons - Only show on other pages */}
            {!showPageToggle && (
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
            )}
          </div>

          {/* User Profile & Sign Out */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-brand-200"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 rounded-xl transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
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
      <AuthProvider>
        <div className="min-h-screen bg-off-white">
          <Navigation />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collections"
              element={
                <ProtectedRoute>
                  <CollectionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collection/:collectionId"
              element={
                <ProtectedRoute>
                  <CollectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collection"
              element={
                <ProtectedRoute>
                  <CollectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddWordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review"
              element={
                <ProtectedRoute>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;

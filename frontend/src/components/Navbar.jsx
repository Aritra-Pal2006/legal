import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, FileText } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className=\"bg-white shadow-lg border-b\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <div className=\"flex justify-between items-center h-16\">
          {/* Logo */}
          <Link to=\"/\" className=\"flex items-center space-x-2\">
            <FileText className=\"h-8 w-8 text-blue-600\" />
            <span className=\"text-xl font-bold text-gray-900\">LegalAI</span>
          </Link>

          {/* Navigation Links */}
          <div className=\"hidden md:flex items-center space-x-8\">
            <Link
              to=\"/\"
              className=\"text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors\"
            >
              Home
            </Link>
            {user && (
              <Link
                to=\"/dashboard\"
                className=\"text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors\"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className=\"flex items-center space-x-4\">
            {user ? (
              <div className=\"flex items-center space-x-4\">
                <div className=\"flex items-center space-x-2\">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || user.email}
                      className=\"h-8 w-8 rounded-full\"
                    />
                  ) : (
                    <div className=\"h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center\">
                      <User className=\"h-5 w-5 text-blue-600\" />
                    </div>
                  )}
                  <span className=\"text-sm font-medium text-gray-700\">
                    {user.displayName || user.email}
                  </span>
                </div>
                
                <div className=\"flex items-center space-x-2\">
                  <Link
                    to=\"/profile\"
                    className=\"p-2 text-gray-400 hover:text-gray-600 transition-colors\"
                    title=\"Profile\"
                  >
                    <Settings className=\"h-5 w-5\" />
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className=\"p-2 text-gray-400 hover:text-gray-600 transition-colors\"
                    title=\"Sign Out\"
                  >
                    <LogOut className=\"h-5 w-5\" />
                  </button>
                </div>
              </div>
            ) : (
              <div className=\"flex items-center space-x-4\">
                <Link
                  to=\"/login\"
                  className=\"text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors\"
                >
                  Sign In
                </Link>
                <Link
                  to=\"/register\"
                  className=\"bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors\"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;"
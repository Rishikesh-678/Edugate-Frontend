import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import SignUpModal from '../auth/SignUpModal';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openLogin = () => {
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  const openSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            EduGate
          </Link>

          {/* Search Bar (Placeholder) */}
          <div className="hidden flex-1 px-8 md:flex">
            <input
              type="search"
              placeholder="Search..."
              className="w-full max-w-xs rounded-md border px-3 py-1.5 text-sm"
            />
          </div>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Role-Specific Links */}
                {user.role === 'ROLE_USER' && (
                  <Link
                    to="/my-courses"
                    className="text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    My Courses
                  </Link>
                )}
                {user.role === 'ROLE_INSTRUCTOR' && (
                  <Link
                    to="/instructor/add-course"
                    className="text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    Add Courses
                  </Link>
                )}
                {user.role === 'ROLE_ADMIN' && (
                  <Link
                    to="/admin/manage"
                    className="text-sm font-medium text-gray-600 hover:text-primary"
                  >
                    Manage
                  </Link>
                )}

                {/* Profile/Logout */}
                <Link
                  to="/profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-sm font-medium text-white"
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-primary"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                {/* Public Links */}
                <button
                  onClick={openSignUp}
                  className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  Sign Up
                </button>
                <button
                  onClick={openLogin}
                  className="rounded-md border border-transparent bg-primary px-4 py-1.5 text-sm font-medium text-black hover:bg-primary-dark"
                >
                  Log In
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignUp={openSignUp}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}
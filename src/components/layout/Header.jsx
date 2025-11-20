// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import LoginModal from '../auth/LoginModal';
// import SignUpModal from '../auth/SignUpModal';

// export default function Header() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isLoginOpen, setLoginOpen] = useState(false);
//   const [isSignUpOpen, setSignUpOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [displayName, setDisplayName] = useState(user?.fullName || '');

//   // Update displayName when user changes
//   useEffect(() => {
//     if (user?.fullName) {
//       setDisplayName(user.fullName);
//     }
//   }, [user?.fullName]);

//   // Listen for profile update events
//   useEffect(() => {
//     const handleProfileUpdate = (event) => {
//       if (event.detail?.fullName) {
//         setDisplayName(event.detail.fullName);
//       }
//     };
//     window.addEventListener('profileUpdated', handleProfileUpdate);
//     return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const openLogin = () => {
//     setSignUpOpen(false);
//     setLoginOpen(true);
//   };

//   const openSignUp = () => {
//     setLoginOpen(false);
//     setSignUpOpen(true);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       const trimmedQuery = searchQuery.trim();
//       // If admin is on manage users page, search users
//       if (user?.role === 'ROLE_ADMIN' && location.pathname === '/admin/manage') {
//         // Dispatch search event for AdminManageUsersPage to handle
//         window.dispatchEvent(new CustomEvent('searchUsers', { detail: trimmedQuery }));
//       } else {
//         // For user/instructor pages, dispatch searchCourses event
//         window.dispatchEvent(new CustomEvent('searchCourses', { detail: trimmedQuery }));
//       }
//       setSearchQuery('');
//     }
//   };

//   // Show different placeholder based on role and current page
//   const getSearchPlaceholder = () => {
//     if (user?.role === 'ROLE_ADMIN' && location.pathname === '/admin/manage') {
//       return 'Search users...';
//     }
//     return 'Search courses...';
//   };

//   // Hide search bar on profile pages, course detail page, add course, my courses, admin dashboard, and public landing page
//   const showSearchBar = location.pathname !== '/' && location.pathname !== '/profile' && location.pathname !== '/instructor/profile' && location.pathname !== '/admin/dashboard' && !location.pathname.startsWith('/course/') && location.pathname !== '/instructor/add-course' && location.pathname !== '/my-courses' && !location.pathname.startsWith('/instructor/edit-course/');

//   return (
//     <>
//       <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
//         <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//           <Link to="/" className="text-2xl font-bold text-primary">
//             EduGate
//           </Link>

//           {/* Search Bar - Desktop Only */}
//           {showSearchBar && (
//             <div className="hidden flex-1 px-4 md:flex">
//               <form onSubmit={handleSearchSubmit} className="w-full">
//                 <input
//                   type="search"
//                   placeholder={getSearchPlaceholder()}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   aria-label={getSearchPlaceholder()}
//                   className="w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//               </form>
//             </div>
//           )}

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-4">
//             {user ? (
//               <>
//                 {/* Role-Specific Links */}
//                 {user.role === 'ROLE_USER' && (
//                   <Link
//                     to="/my-courses"
//                     className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
//                   >
//                     My Courses
//                   </Link>
//                 )}
//                 {user.role === 'ROLE_INSTRUCTOR' && (
//                   <Link
//                     to="/instructor/add-course"
//                     className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
//                   >
//                     Add Courses
//                   </Link>
//                 )}
//                 {user.role === 'ROLE_ADMIN' && (
//                   <Link
//                     to="/admin/manage"
//                     className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
//                   >
//                     Manage
//                   </Link>
//                 )}

//                 {/* Profile/Logout */}
//                 <Link
//                   to={user.role === 'ROLE_INSTRUCTOR' ? '/instructor/profile' : '/profile'}
//                   className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-sm font-medium text-white hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
//                   aria-label={`Go to ${user.role === 'ROLE_INSTRUCTOR' ? 'instructor' : 'user'} profile`}
//                 >
//                   {displayName?.charAt(0)?.toUpperCase() || 'U'}
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="rounded-md border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white transition-colors"
//                 >
//                   Log Out
//                 </button>
//               </>
//             ) : (
//               <>
//                 {/* Public Links */}
//                 <button
//                   onClick={openSignUp}
//                   className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
//                 >
//                   Sign Up
//                 </button>
//                 <button
//                   onClick={openLogin}
//                   className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-dark transition-colors"
//                 >
//                   Log In
//                 </button>
//               </>
//             )}
//           </nav>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
//             className="md:hidden p-2 rounded-md hover:bg-gray-100"
//             aria-label="Toggle menu"
//             aria-expanded={isMobileMenuOpen}
//           >
//             <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
//             </svg>
//           </button>
//         </div>

//         {/* Mobile Search Bar */}
//         {showSearchBar && isMobileMenuOpen && (
//           <div className="md:hidden border-t bg-white px-4 py-3">
//             <form onSubmit={handleSearchSubmit} className="w-full">
//               <input
//                 type="search"
//                 placeholder={getSearchPlaceholder()}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 aria-label={getSearchPlaceholder()}
//                 className="w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </form>
//           </div>
//         )}

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <nav className="md:hidden border-t bg-white">
//             <div className="px-4 py-3 space-y-2">
//               {user ? (
//                 <>
//                   {/* Role-Specific Links */}
//                   {user.role === 'ROLE_USER' && (
//                     <Link
//                       to="/my-courses"
//                       onClick={() => setMobileMenuOpen(false)}
//                       className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
//                     >
//                       My Courses
//                     </Link>
//                   )}
//                   {user.role === 'ROLE_INSTRUCTOR' && (
//                     <Link
//                       to="/instructor/add-course"
//                       onClick={() => setMobileMenuOpen(false)}
//                       className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
//                     >
//                       Add Courses
//                     </Link>
//                   )}
//                   {user.role === 'ROLE_ADMIN' && (
//                     <Link
//                       to="/admin/manage"
//                       onClick={() => setMobileMenuOpen(false)}
//                       className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
//                     >
//                       Manage
//                     </Link>
//                   )}

//                   {/* Profile Link */}
//                   <Link
//                     to={user.role === 'ROLE_INSTRUCTOR' ? '/instructor/profile' : '/profile'}
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
//                   >
//                     Profile
//                   </Link>

//                   {/* Logout Button */}
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMobileMenuOpen(false);
//                     }}
//                     className="block w-full rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white transition-colors"
//                   >
//                     Log Out
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   {/* Public Links */}
//                   <button
//                     onClick={() => {
//                       openSignUp();
//                       setMobileMenuOpen(false);
//                     }}
//                     className="block w-full rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
//                   >
//                     Sign Up
//                   </button>
//                   <button
//                     onClick={() => {
//                       openLogin();
//                       setMobileMenuOpen(false);
//                     }}
//                     className="block w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-dark transition-colors"
//                   >
//                     Log In
//                   </button>
//                 </>
//               )}
//             </div>
//           </nav>
//         )}
//       </header>

//       {/* Modals */}
//       <LoginModal
//         isOpen={isLoginOpen}
//         onClose={() => setLoginOpen(false)}
//         onSwitchToSignUp={openSignUp}
//       />
//       <SignUpModal
//         isOpen={isSignUpOpen}
//         onClose={() => setSignUpOpen(false)}
//         onSwitchToLogin={openLogin}
//       />
//     </>
//   );
// }
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import SignUpModal from '../auth/SignUpModal';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const trimmedQuery = searchQuery.trim();
      if (user?.role === 'ROLE_ADMIN' && location.pathname === '/admin/manage') {
        window.dispatchEvent(new CustomEvent('searchUsers', { detail: trimmedQuery }));
      } else {
        window.dispatchEvent(new CustomEvent('searchCourses', { detail: trimmedQuery }));
      }
      setSearchQuery('');
    }
  };

  const getSearchPlaceholder = () => {
    if (user?.role === 'ROLE_ADMIN' && location.pathname === '/admin/manage') {
      return 'Search users...';
    }
    return 'Search courses...';
  };

  const showSearchBar = location.pathname !== '/' && location.pathname !== '/profile' && location.pathname !== '/instructor/profile' && location.pathname !== '/admin/dashboard' && !location.pathname.startsWith('/course/') && location.pathname !== '/instructor/add-course' && location.pathname !== '/my-courses' && !location.pathname.startsWith('/instructor/edit-course/') && location.pathname !== '/admin/manage-courses';

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            EduGate
          </Link>

          {showSearchBar && (
            <div className="hidden flex-1 px-4 md:flex">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <input
                  type="search"
                  placeholder={getSearchPlaceholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={getSearchPlaceholder()}
                  className="w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </form>
            </div>
          )}

          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'ROLE_USER' && (
                  <Link
                    to="/my-courses"
                    className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
                  >
                    My Courses
                  </Link>
                )}
                {user.role === 'ROLE_INSTRUCTOR' && (
                  <Link
                    to="/instructor/add-course"
                    className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
                  >
                    Add Courses
                  </Link>
                )}
                {/* Updated ADMIN links */}
                {user.role === 'ROLE_ADMIN' && (
                  <>
                    <Link
                      to="/admin/manage"
                      className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/manage-courses"
                      className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
                    >
                      Manage Courses
                    </Link>
                  </>
                )}

                <Link
                  to={user.role === 'ROLE_INSTRUCTOR' ? '/instructor/profile' : '/profile'}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-sm font-medium text-white hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Go to ${user.role === 'ROLE_INSTRUCTOR' ? 'instructor' : 'user'} profile`}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openSignUp}
                  className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={openLogin}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-dark transition-colors"
                >
                  Log In
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Search Bar */}
        {showSearchBar && isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-3">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                type="search"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={getSearchPlaceholder()}
                className="w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-2">
              {user ? (
                <>
                  {user.role === 'ROLE_USER' && (
                    <Link
                      to="/my-courses"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
                    >
                      My Courses
                    </Link>
                  )}
                  {user.role === 'ROLE_INSTRUCTOR' && (
                    <Link
                      to="/instructor/add-course"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
                    >
                      Add Courses
                    </Link>
                  )}
                  {user.role === 'ROLE_ADMIN' && (
                    <>
                      <Link
                        to="/admin/manage"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
                      >
                        Manage Users
                      </Link>
                      <Link
                        to="/admin/manage-courses"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
                      >
                        Manage Courses
                      </Link>
                    </>
                  )}

                  <Link
                    to={user.role === 'ROLE_INSTRUCTOR' ? '/instructor/profile' : '/profile'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors text-center"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openSignUp();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      openLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary-dark transition-colors"
                  >
                    Log In
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

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
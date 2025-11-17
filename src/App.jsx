import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Import Layouts
import MainLayout from './components/layout/MainLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Import Pages
import PublicLandingPage from './pages/public/PublicLandingPage.jsx';
import CourseDetailPage from './pages/public/CourseDetailPage.jsx';

// User Pages
import UserDashboard from './pages/user/UserDashboard.jsx';
import MySubscriptionsPage from './pages/user/MySubscriptionsPage.jsx';
import UserProfilePage from './pages/user/UserProfilePage.jsx';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard.jsx';
import AddCoursePage from './pages/instructor/AddCoursePage.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminManageUsersPage from './pages/admin/AdminManageUsersPage.jsx';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect logic after login
  const getHomeRoute = () => {
    if (!user) return <PublicLandingPage />;
    switch (user.role) {
      case 'ROLE_ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'ROLE_INSTRUCTOR':
        return <Navigate to="/instructor/dashboard" replace />;
      case 'ROLE_USER':
        return <Navigate to="/dashboard" replace />;
      default:
        return <PublicLandingPage />;
    }
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* --- Public Routes --- */}
        <Route path="/" element={getHomeRoute()} />
        <Route path="/course/:id" element={<CourseDetailPage />} />

        {/* --- User Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_USER']} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/my-courses" element={<MySubscriptionsPage />} />
        </Route>

        {/* --- Instructor Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_INSTRUCTOR']} />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/add-course" element={<AddCoursePage />} />
        </Route>

        {/* --- Admin Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage" element={<AdminManageUsersPage />} />
        </Route>

        {/* --- Shared Routes (All logged-in users) --- */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={['ROLE_USER', 'ROLE_INSTRUCTOR', 'ROLE_ADMIN']}
            />
          }
        >
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>

        {/* --- Not Found --- */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
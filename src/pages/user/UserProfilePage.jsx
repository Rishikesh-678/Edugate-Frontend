import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMyProfile, updateMyProfile, getLiveCourses } from '../../services/apiService.js';
import Breadcrumbs from '../../components/common/BreadCrumps.jsx';
import CourseCard from '../../components/common/CourseCard.jsx';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = () => {
    if (user?.role === 'ROLE_USER') {
      getLiveCourses()
        .then((res) => {
          setSuggestions(res.data || res || []);
        })
        .catch((err) => console.error('Failed to fetch suggestions:', err));
    }
    setLoading(false);
  };

  // --- NEW BREADCRUMB DATA (Dynamic based on role) ---
  const getDashboardPath = () => {
    switch (user?.role) {
      case 'ROLE_ADMIN':
        return { name: 'Admin Dashboard', path: '/admin/dashboard' };
      case 'ROLE_INSTRUCTOR':
        return { name: 'Instructor Dashboard', path: '/instructor/dashboard' };
      default:
        return { name: 'Dashboard', path: '/dashboard' };
    }
  };

  const breadcrumbs = [
    getDashboardPath(),
    { name: 'Public Profile' }, // Current page
  ];
  // ----------------------------------------------------

  useEffect(() => {
    // Fetch full profile details
    getMyProfile()
      .then((res) => {
        setFullName(res.data.fullName);
        setPhoneNumber(res.data.phoneNumber || '');
        fetchSuggestions();
      })
      .catch((err) => {
        console.error('Failed to fetch profile', err);
        setLoading(false);
      });
  }, [user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await updateMyProfile({ fullName, phoneNumber });
      setMessage('Profile updated successfully!');
      // Note: AuthContext user won't update fullName automatically.
      // You might need to add an `updateUser` function to AuthContext.
    } catch (error) {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* --- ADD BREADCRUMBS HERE --- */}
      <div className="mb-6">
        <Breadcrumbs crumbs={breadcrumbs} />
      </div>
      {/* ----------------------------- */}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Public Profile</h1>
        <button
          onClick={logout}
          className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:col-span-2">
          {message && (
            <p className="rounded-md bg-green-100 p-3 text-sm text-green-700">
              {message}
            </p>
          )}
          <div>
            <label
              htmlFor="fullName"
              className="block text-lg font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-200 px-3 py-2 text-gray-500 shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-lg font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2 font-semibold text-black hover:bg-primary-dark"
          >
            Update Profile
          </button>
        </form>

        {/* Avatar */}
        <div className="flex items-start justify-center">
          <div className="flex h-48 w-48 items-center justify-center rounded-full bg-pink-600 text-8xl font-medium text-white">
            {user?.fullName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Recommended Section (for ROLE_USER) */}
      {user?.role === 'ROLE_USER' && (
        <>
          <h2 className="mb-8 mt-16 text-3xl font-bold">
            Recommended For You..
          </h2>
          {!loading && suggestions.length === 0 ? (
            <div className="py-8 text-center text-gray-600">No recommendations available.</div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
              {suggestions.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  linkTo={`/course/${course.id}`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Placeholder for Instructor/Admin sections on profile */}
      {user?.role === 'ROLE_INSTRUCTOR' && (
        <h2 className="mb-8 mt-16 text-3xl font-bold">Most Subscribed..</h2>
      )}
      {user?.role === 'ROLE_ADMIN' && (
        <h2 className="mb-8 mt-16 text-3xl font-bold">
          Recently Viewed Requests..
        </h2>
      )}
    </div>
  );
}
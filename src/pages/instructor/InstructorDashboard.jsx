import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import CourseCarousel from '../../components/common/CourseCarousel';
import { getMyCourses } from '../../services/apiService.js';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadCourses = useCallback(() => {
    setLoading(true);
    setError('');
    getMyCourses()
      .then((res) => {
        const coursesData = res.data || res || [];
        setMyCourses(coursesData);
        setFilteredCourses(coursesData);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load your courses.');
        setMyCourses([]);
        setFilteredCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Reload when page becomes visible (for breadcrumb navigation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCourses();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadCourses]);

  // Filter courses based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = myCourses.filter(
        (course) => course.courseName?.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(myCourses);
    }
  }, [myCourses, searchQuery]);

  // Listen for search events from Header
  useEffect(() => {
    const handleSearch = (event) => {
      setSearchQuery(event.detail);
    };
    window.addEventListener('searchCourses', handleSearch);
    return () => window.removeEventListener('searchCourses', handleSearch);
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      {/* Banner with Background Image */}
      <div
        className="mb-12 sm:mb-16 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat relative h-64 sm:h-80 bg-gradient-to-r from-purple-500 to-purple-600"
        style={{
          backgroundImage:
            'url("/banners/instructor-dashboard-banner.jpg")',
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full p-6 sm:p-8 md:flex-row md:p-12">
          <div className="text-center md:text-left">
            <h1 className="text-xl sm:text-3xl font-bold text-white">
              Welcome {user?.fullName || 'Instructor'} 👋
            </h1>
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Recently Added..</h2>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="rounded-md border border-primary px-4 py-2 text-xs sm:text-sm font-medium text-primary hover:bg-primary hover:text-black transition-colors w-full sm:w-auto"
          >
            Clear Search
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="mb-4 text-xs sm:text-sm text-gray-600">
          Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-xs sm:text-sm text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <div className="py-8 text-center text-gray-600">Loading your courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-8 text-center text-gray-600">
          {searchQuery ? 'No courses found matching your search.' : 'You haven\'t added any courses yet.'}
        </div>
      ) : (
        <CourseCarousel courses={filteredCourses} />
      )}
    </div>
  );
}
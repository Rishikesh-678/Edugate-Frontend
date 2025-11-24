import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CourseCarousel from '../../components/common/CourseCarousel';
import { getLiveCourses } from '../../services/apiService.js';

export default function UserDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getLiveCourses()
      .then((response) => {
        setCourses(response.data || response || []);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses.');
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter courses based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = courses.filter(
        (course) => course.courseName?.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [courses, searchQuery]);

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
      {/* Hero Section */}
      <div
        className="mb-12 sm:mb-16 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat relative h-64 sm:h-80 bg-gradient-to-r from-blue-500 to-blue-600"
        style={{
          backgroundImage:
            'url("/banners/user-dashboard-banner.jpg")',
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full p-6 sm:p-8 md:flex-row md:p-12">
          <div className="text-center md:text-left">
            <h1 className="mb-2 text-xl sm:text-3xl font-bold text-white">
              Welcome {user?.fullName || 'User'} 
            </h1>
            <p className="text-lg sm:text-2xl font-semibold text-white">
              Start With Your Learning
            </p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">What to learn NEXT..</h2>
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
          <div className="py-8 text-center text-gray-600">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-8 text-center text-gray-600">
            {searchQuery ? 'No courses found matching your search.' : 'No courses available.'}
          </div>
        ) : (
          <CourseCarousel courses={filteredCourses} />
        )}
      </div>
    </div>
  );
}
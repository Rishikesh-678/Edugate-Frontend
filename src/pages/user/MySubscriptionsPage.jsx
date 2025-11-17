import React, { useState, useEffect } from 'react';
import CourseCard from '../../components/common/CourseCard.jsx';
import {
  unsubscribeFromCourse,
  getMySubscriptions,
  getLiveCourses,
} from '../../services/apiService.js';
import Breadcrumbs from '../../components/common/BreadCrumps.jsx';

export default function MySubscriptionsPage() {
  const [myCourses, setMyCourses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = () => {
    setLoading(true);
    setError('');
    Promise.all([getMySubscriptions(), getLiveCourses()])
      .then(([myCoursesRes, suggestionsRes]) => {
        setMyCourses(myCoursesRes.data || myCoursesRes || []);
        setSuggestions(suggestionsRes.data || suggestionsRes || []);
      })
      .catch((err) => {
        console.error('Failed to fetch subscriptions:', err);
        setError('Failed to load courses.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- NEW BREADCRUMB DATA ---
  const breadcrumbs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Courses' }, // Current page
  ];
  // ----------------------------

  const handleUnsubscribe = async (courseId) => {
    if (window.confirm('Are you sure you want to unsubscribe?')) {
      try {
        await unsubscribeFromCourse(courseId);
        alert('Unsubscribed!');
        fetchCourses(); // Re-fetch data
      } catch (error) {
        alert('Failed to unsubscribe.');
      }
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* --- ADD BREADCRUMBS HERE --- */}
      <div className="mb-6">
        <Breadcrumbs crumbs={breadcrumbs} />
      </div>
      {/* ----------------------------- */}

      <h1 className="mb-8 text-3xl font-bold">My Courses</h1>
      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <div className="py-8 text-center text-gray-600">Loading your courses...</div>
      ) : myCourses.length === 0 ? (
        <div className="py-8 text-center text-gray-600">You haven't subscribed to any courses yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
          {myCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              linkTo={`/course/${course.id}`}
            >
              <button
                onClick={() => handleUnsubscribe(course.id)}
                className="w-full rounded-md border border-gray-300 py-1.5 text-sm font-medium hover:bg-gray-100"
              >
                Unsubscribe
              </button>
            </CourseCard>
          ))}
        </div>
      )}

      <h2 className="mb-8 mt-16 text-3xl font-bold">Suggestions..</h2>
      {suggestions.length === 0 ? (
        <div className="py-8 text-center text-gray-600">No suggestions available.</div>
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
    </div>
  );
}
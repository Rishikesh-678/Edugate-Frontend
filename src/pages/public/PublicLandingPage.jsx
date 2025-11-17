import React, { useState, useEffect } from 'react';
import CourseCard from '../../components/common/CourseCard.jsx';
import { getLiveCourses } from '../../services/apiService.js';

export default function PublicLandingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch courses if not on the public landing (to avoid auto-loading)
    // This page can work without data - it's the public home page
    setLoading(false);
    setError('');
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-orange-400">
        <div className="flex flex-col items-center justify-between p-8 md:flex-row md:p-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-800 md:mb-0">
            Learning that
            <br />
            gets you...
          </h1>
          <img
            src="https://placehold.co/300x300/FFFFFF/4A4A4A?text=Instructor"
            alt="Instructor"
            className="h-48 w-48 rounded-full object-cover md:h-64 md:w-64"
          />
        </div>
      </div>

      {/* About Us Section */}
      <div className="mb-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <img
          src="https://placehold.co/400x300/EEEEEE/4A4A4A?text=Books+Icon"
          alt="About Us"
          className="h-auto w-full max-w-sm rounded-lg"
        />
        <div>
          <h2 className="mb-4 text-3xl font-bold">About Us</h2>
          <p className="text-gray-700">
            At EduGate, we believe quality education should be accessible to
            everyone. Our platform connects learners with expert instructors,
            offering engaging courses across technology, business, creativity,
            and more. Whether you're upskilling for a career or exploring a new
            passion, EduGate is your gateway to knowledge and growth.
          </p>
        </div>
      </div>

      {/* Essential Skills Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            Learn Essential Skills...
          </h2>
          <button
            onClick={() => {
              setLoading(true);
              setError('');
              getLiveCourses()
                .then((response) => {
                  setCourses(response.data || response || []);
                })
                .catch((err) => {
                  console.error('Failed to fetch courses:', err);
                  setError('Failed to load courses. Please try again later.');
                  setCourses([]);
                })
                .finally(() => setLoading(false));
            }}
            className="rounded-md border border-gray-400 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>
        {error && (
          <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {loading ? (
          <div className="py-8 text-center text-gray-600">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="py-8 text-center text-gray-600">No courses available yet. Click Refresh to reload.</div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                linkTo={`/course/${course.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CourseCard from '../../components/common/CourseCard';
import { getLiveCourses } from '../../services/apiService.js';

export default function UserDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-16 overflow-hidden rounded-lg bg-orange-100">
        <div className="flex flex-col items-center justify-between p-8 md:flex-row md:p-12">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Welcome {user?.fullName} 👋
            </h1>
            <p className="text-2xl font-semibold text-orange-600">
              Start With Your Learning
            </p>
          </div>
          <img
            src="https://placehold.co/300x200/FFFFFF/4A4A4A?text=Learning+Icon"
            alt="Learning"
            className="h-auto w-48 object-cover"
          />
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <h2 className="mb-8 text-3xl font-bold">What to learn NEXT..</h2>
        {error && (
          <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {loading ? (
          <div className="py-8 text-center text-gray-600">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="py-8 text-center text-gray-600">No courses available.</div>
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
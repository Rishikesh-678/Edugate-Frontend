import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CourseCard from '../../components/common/CourseCard';
import { getMyCourses } from '../../services/apiService.js';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getMyCourses()
      .then((res) => {
        setMyCourses(res.data || res || []);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load your courses.');
        setMyCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">
        Welcome Instructor {user?.fullName} 👋
      </h1>

      {/* Placeholder for Banner */}
      <div className="mb-16 h-48 rounded-lg bg-gray-200 p-8">
        Your Dashboard Banner
      </div>

      <h2 className="mb-8 text-3xl font-bold">Recently Added..</h2>
      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <div className="py-8 text-center text-gray-600">Loading your courses...</div>
      ) : myCourses.length === 0 ? (
        <div className="py-8 text-center text-gray-600">You haven't added any courses yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
          {myCourses.map((course) => (
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
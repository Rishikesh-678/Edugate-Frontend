import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCarousel from '../../components/common/CourseCarousel.jsx';
import {
  unsubscribeFromCourse,
  getMySubscriptions,
  getLiveCourses,
} from '../../services/apiService.js';
import ConfirmationModal from '../../components/common/ConfirmationModal.jsx';

export default function MySubscriptionsPage() {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

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

  const handleUnsubscribe = async (courseId) => {
    setSelectedCourseId(courseId);
    setShowConfirmModal(true);
  };

  const handleConfirmUnsubscribe = async () => {
    if (!selectedCourseId) return;
    
    setShowConfirmModal(false);
    setIsUnsubscribing(true);
    try {
      await unsubscribeFromCourse(selectedCourseId);
      fetchCourses(); // Re-fetch data
    } catch (error) {
      console.error('Unsubscribe error:', error);
      alert('Failed to unsubscribe.');
    } finally {
      setIsUnsubscribing(false);
      setSelectedCourseId(null);
    }
  };

  const handleCancelUnsubscribe = () => {
    setShowConfirmModal(false);
    setSelectedCourseId(null);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-primary hover:text-orange-600 font-medium transition-colors"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

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
        <CourseCarousel
          courses={myCourses}
          renderButton={(course) => (
            <button
              onClick={() => handleUnsubscribe(course.id)}
              disabled={isUnsubscribing && selectedCourseId === course.id}
              className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isUnsubscribing && selectedCourseId === course.id ? 'Processing...' : 'Unsubscribe'}
            </button>
          )}
        />
      )}

      <h2 className="mb-8 mt-16 text-3xl font-bold">Suggestions..</h2>
      {suggestions.length === 0 ? (
        <div className="py-8 text-center text-gray-600">No suggestions available.</div>
      ) : (
        <CourseCarousel courses={suggestions} />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Unsubscribe from Course?"
        message="Are you sure you want to unsubscribe from this course?"
        confirmText="Unsubscribe"
        cancelText="Cancel"
        onConfirm={handleConfirmUnsubscribe}
        onCancel={handleCancelUnsubscribe}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
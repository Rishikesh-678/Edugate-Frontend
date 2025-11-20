import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { subscribeToCourse, unsubscribeFromCourse } from '../../services/apiService.js';
import api from '../../services/apiService.js';
import ConfirmationModal from '../../components/common/ConfirmationModal.jsx';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState('subscribe'); // 'subscribe' or 'unsubscribe'
  const [isOwner, setIsOwner] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setIsOwner(false); // Reset ownership on each load
    api
      .get(`/public/courses/${id}`)
      .then((res) => {
        const courseData = res.data || res;
        setCourse(courseData);
        // Check if user is subscribed (backend should indicate this)
        // For now, we'll check when we get user's subscriptions
        if (user) {
          checkSubscriptionStatus();
          // Check if user is the course owner
          if (user.role === 'ROLE_INSTRUCTOR' && courseData.createdById === user.id) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        } else {
          setIsOwner(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course. Please try again later.');
        setIsOwner(false);
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  const checkSubscriptionStatus = async () => {
    try {
      const res = await api.get('/user/courses/my-subscriptions');
      const mySubscriptions = res.data || res;
      const subscribed = mySubscriptions.some((c) => c.id === parseInt(id));
      setIsSubscribed(subscribed);
    } catch (err) {
      console.error('Failed to check subscription status:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center" role="status" aria-live="polite" aria-busy="true">
        <p className="text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center" role="status" aria-live="assertive">
        <p className="text-red-600">{error || 'Course not found.'}</p>
      </div>
    );
  }



  const handleSubscribeClick = () => {
    setConfirmAction('subscribe');
    setShowConfirmModal(true);
  };

  const handleUnsubscribeClick = () => {
    setConfirmAction('unsubscribe');
    setShowConfirmModal(true);
  };

  const handleConfirmSubscription = async () => {
    setShowConfirmModal(false);
    setIsSubscribing(true);
    try {
      if (confirmAction === 'subscribe') {
        await subscribeToCourse(course.id);
        setIsSubscribed(true);
      } else {
        await unsubscribeFromCourse(course.id);
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      // Show error to user (could use a toast notification)
      alert(
        `Failed to ${confirmAction}: ` +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCancelSubscription = () => {
    setShowConfirmModal(false);
  };

  const handleRemoveCourse = () => {
    setConfirmAction('remove');
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    setShowConfirmModal(false);
    setIsRemoving(true);
    try {
      await api.delete(`/instructor/courses/${course.id}`);
      alert('Course removal requested successfully!');
      navigate('/instructor/dashboard');
    } catch (error) {
      console.error('Remove course error:', error);
      alert(
        `Failed to remove course: ` +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsRemoving(false);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      console.error('Invalid URL for embedding:', url);
    }
    return url; // fallback
  };

  const embedUrl = getYoutubeEmbedUrl(course.videoLink);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
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

      <div className="mb-8 flex flex-col justify-between gap-6 sm:gap-8 md:flex-row md:gap-12">
        {/* Course Info */}
        <div className="flex-1 md:mb-0">
          <h1 className="mb-4 text-2xl sm:text-4xl font-bold leading-tight">{course.courseName}</h1>
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm sm:text-base text-gray-700">
              <span className="font-semibold">Instructor:</span> <span className="text-gray-900">{course.instructor}</span>
            </p>
            <p className="text-sm sm:text-base text-gray-700">
              <span className="font-semibold">Category:</span> <span className="text-gray-900">{course.category}</span>
            </p>
          </div>
        </div>
        {/* Thumbnail & Subscribe Button */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:w-56">
          <img
            src={course.thumbnailUrl}
            alt={course.courseName}
            className="w-full rounded-lg object-cover shadow-md"
            onError={(e) =>
              (e.target.src =
                'https://placehold.co/200x150/F9A826/4A4A4A?text=EduGate')
            }
          />
          {user && (
            <div className="w-full space-y-2">
              {isOwner && (
                <>
                  <button
                    onClick={handleRemoveCourse}
                    disabled={isRemoving}
                    className="w-full btn-danger-secondary disabled:opacity-50 text-xs sm:text-sm"
                  >
                    {isRemoving ? 'Removing...' : 'Remove Course'}
                  </button>
                  <button
                    onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                    className="w-full btn-info-secondary text-xs sm:text-sm"
                  >
                    Edit Course
                  </button>
                </>
              )}
              {!isOwner && (
                <>
                  {isSubscribed ? (
                    <button
                      onClick={handleUnsubscribeClick}
                      disabled={isSubscribing}
                      className="w-full btn-danger-secondary disabled:opacity-50 text-xs sm:text-sm"
                    >
                      {isSubscribing ? 'Processing...' : 'Unsubscribe'}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribeClick}
                      disabled={isSubscribing}
                      className="w-full btn-secondary disabled:opacity-50 text-xs sm:text-sm"
                    >
                      {isSubscribing ? 'Processing...' : 'Subscribe'}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          {!user && (
            <p className="text-center text-xs sm:text-sm text-gray-600">
              <Link to="/" className="font-semibold text-primary hover:underline">
                Log in
              </Link>{' '}
              to subscribe.
            </p>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="mt-12">
        {embedUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={`Course video: ${course.courseName}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="rounded-lg border bg-gray-100 p-12 text-center text-gray-600">
            <p className="text-sm">Video link is not a valid YouTube URL.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal - Positioned at root level */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={
          confirmAction === 'subscribe'
            ? 'Subscribe to Course?'
            : confirmAction === 'remove'
            ? 'Remove Course?'
            : 'Unsubscribe from Course?'
        }
        message={
          confirmAction === 'subscribe'
            ? `Are you sure you want to subscribe to "${course.courseName}"?`
            : confirmAction === 'remove'
            ? `Are you sure you want to remove "${course.courseName}"? This action cannot be undone.`
            : `Are you sure you want to unsubscribe from "${course.courseName}"?`
        }
        confirmText={
          confirmAction === 'subscribe'
            ? 'Subscribe'
            : confirmAction === 'remove'
            ? 'Remove'
            : 'Unsubscribe'
        }
        cancelText="Cancel"
        onConfirm={
          confirmAction === 'remove' ? handleConfirmRemove : handleConfirmSubscription
        }
        onCancel={handleCancelSubscription}
        confirmButtonClass={
          confirmAction === 'subscribe'
            ? 'bg-primary hover:bg-primary-dark'
            : 'bg-red-600 hover:bg-red-700'
        }
      />
    </div>
  );
}
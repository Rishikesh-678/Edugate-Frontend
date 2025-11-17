import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { subscribeToCourse } from '../../services/apiService.js';
import api from '../../services/apiService.js';
import Breadcrumbs from '../../components/common/BreadCrumps.jsx';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/user/courses/${id}`)
      .then((res) => {
        setCourse(res.data || res);
      })
      .catch((err) => {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-red-600">{error || 'Course not found.'}</p>
      </div>
    );
  }

  // --- NEW BREADCRUMB DATA ---
  const breadcrumbs = [
    { name: 'Home', path: user ? '/dashboard' : '/' },
    { name: course.courseName }, // Current page
  ];
  // ----------------------------

  const handleSubscribe = async () => {
    try {
      await subscribeToCourse(course.id);
      alert('Subscribed successfully!');
      // You might want to update UI state, e.g., change button to "Unsubscribe"
    } catch (error) {
      alert(
        'Failed to subscribe: ' +
          (error.response?.data?.message || error.message)
      );
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
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* --- ADD BREADCRUMBS HERE --- */}
      <div className="mb-6">
        <Breadcrumbs crumbs={breadcrumbs} />
      </div>
      {/* ----------------------------- */}

      <div className="flex flex-col items-start justify-between md:flex-row">
        {/* Course Info */}
        <div className="mb-4 md:mb-0">
          <h1 className="mb-2 text-3xl font-bold">{course.courseName}</h1>
          <p className="text-lg text-gray-700">
            <strong>Instructor:</strong> {course.instructor}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Category:</strong> {course.category}
          </p>
        </div>
        {/* Thumbnail & Subscribe Button */}
        <div className="flex w-full flex-col items-center md:w-auto md:items-end">
          <img
            src={course.thumbnailUrl}
            alt={course.courseName}
            className="mb-4 w-48 rounded-lg object-cover shadow-md"
            onError={(e) =>
              (e.target.src =
                'https://placehold.co/200x150/F9A826/4A4A4A?text=EduGate')
            }
          />
          {user && (
            <button
              onClick={handleSubscribe}
              className="rounded-lg border border-gray-400 px-8 py-2 font-semibold hover:bg-gray-100"
            >
              Subscribe
            </button>
          )}
          {!user && (
            <p className="text-sm text-gray-600">
              <Link to="/" className="font-semibold text-primary hover:underline">
                Log in
              </Link>{' '}
              to subscribe.
            </p>
          )}
        </div>
      </div>

      {/* Video Player */}
      {embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-xl mt-8">
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
        <div className="mt-8 rounded-lg border bg-gray-100 p-8 text-center text-gray-600">
          Video link is not a valid YouTube URL.
        </div>
      )}
    </div>
  );
}
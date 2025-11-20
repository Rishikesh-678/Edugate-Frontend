import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/apiService.js';

export default function EditCoursePage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseName: '',
    instructor: '',
    category: '',
    videoLink: '',
    thumbnail: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch course details on mount
  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/instructor/courses/${courseId}`)
      .then((res) => {
        const courseData = res.data || res;
        setCourse(courseData);
        setFormData({
          courseName: courseData.courseName || '',
          instructor: courseData.instructor || '',
          category: courseData.category || '',
          videoLink: courseData.videoLink || '',
          thumbnail: null,
        });
        setPreviewImage(courseData.thumbnailUrl);

        // Check ownership (should already be verified by backend, but double-check)
        if (user?.role !== 'ROLE_INSTRUCTOR' || courseData.createdById !== user.id) {
          setError('You do not have permission to edit this course.');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [courseId, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }));
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const updateFormData = new FormData();
      
      // Add only non-empty fields
      if (formData.courseName.trim()) updateFormData.append('courseName', formData.courseName);
      if (formData.instructor.trim()) updateFormData.append('instructor', formData.instructor);
      if (formData.category.trim()) updateFormData.append('category', formData.category);
      if (formData.videoLink.trim()) updateFormData.append('videoLink', formData.videoLink);
      if (formData.thumbnail) updateFormData.append('thumbnail', formData.thumbnail);

      const response = await api.put(
        `/instructor/courses/${courseId}`,
        updateFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Course updated successfully!');
      setTimeout(() => {
        navigate(`/course/${courseId}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to update course:', err);
      setError(
        err.response?.data?.message ||
        'Failed to update course. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Course</h1>
        <button
          type="submit"
          form="edit-course-form"
          disabled={submitting}
          className="rounded-md border border-gray-400 px-6 py-2 font-semibold hover:bg-gray-100 w-full sm:w-auto disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Updating...' : 'Update'}
        </button>
      </div>

      {success && (
        <p className="mb-4 rounded-md bg-green-100 p-3 text-center text-xs sm:text-sm text-green-700" role="status" aria-live="polite">
          {success}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-xs sm:text-sm text-red-700" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <form id="edit-course-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Course Name */}
        <div>
          <label
            htmlFor="courseName"
            className="block text-base sm:text-lg font-medium text-gray-700"
          >
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-white hover:border-primary hover:shadow-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
          />
        </div>

        {/* Instructor Name */}
        <div>
          <label
            htmlFor="instructor"
            className="block text-base sm:text-lg font-medium text-gray-700"
          >
            Taken By (Instructor Name)
          </label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-white hover:border-primary hover:shadow-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-base sm:text-lg font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-white hover:border-primary hover:shadow-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
          />
        </div>

        {/* Video Link */}
        <div>
          <label
            htmlFor="videoLink"
            className="block text-base sm:text-lg font-medium text-gray-700"
          >
            Video Link
          </label>
          <input
            type="url"
            id="videoLink"
            name="videoLink"
            value={formData.videoLink}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-white hover:border-primary hover:shadow-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label
            htmlFor="thumbnail"
            className="block text-base sm:text-lg font-medium text-gray-700"
          >
            Thumbnail (Optional)
          </label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-2 block w-full text-xs sm:text-sm text-gray-500 transition-all duration-300
              file:mr-4 file:rounded-md file:border-0
              file:bg-primary file:px-3 file:sm:px-4 file:py-1.5 file:sm:py-2
              file:text-xs file:sm:text-sm file:font-semibold file:text-black
              file:transition-all file:duration-300
              file:cursor-pointer
              hover:file:bg-primary-dark
              border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 shadow-sm rounded-lg
              hover:bg-white hover:border-primary hover:shadow-md
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
          />
          {previewImage && (
            <div className="mt-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={previewImage}
                alt="Thumbnail preview"
                className="h-40 w-40 rounded-md object-cover shadow-sm"
              />
            </div>
          )}
        </div>

      </form>
    </div>
  );
}

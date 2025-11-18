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
      .get(`/public/courses/${courseId}`)
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

        // Check ownership
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
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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

      <h1 className="mb-8 text-3xl font-bold">Edit Course</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name
          </label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            placeholder="Enter course name"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Instructor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructor Name
          </label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            placeholder="Enter instructor name"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Enter category"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Video Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Link (YouTube URL)
          </label>
          <input
            type="url"
            name="videoLink"
            value={formData.videoLink}
            onChange={handleInputChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail (Optional)
          </label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {previewImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={previewImage}
                alt="Thumbnail preview"
                className="h-40 w-40 rounded-md object-cover"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-6 py-2 font-semibold text-black hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/course/${courseId}`)}
            className="rounded-md border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

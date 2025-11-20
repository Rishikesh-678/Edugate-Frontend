import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCourse } from '../../services/apiService.js'; // <-- Fixed path

export default function AddCoursePage() {
  const [courseName, setCourseName] = useState('');
  const [instructor, setInstructor] = useState(''); // "Taken By"
  const [category, setCategory] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!thumbnail) {
      setError('Thumbnail file is required.');
      return;
    }

    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('instructor', instructor);
    formData.append('category', category);
    formData.append('videoLink', videoLink);
    formData.append('thumbnail', thumbnail);

    try {
      await addCourse(formData);
      setMessage('Course submitted for approval!');
      // Clear form
      setCourseName('');
      setInstructor('');
      setCategory('');
      setVideoLink('');
      setThumbnail(null);
      e.target.reset(); // Reset file input
      
      // Optional: Redirect after success
      // setTimeout(() => navigate('/instructor/dashboard'), 2000);
      
    } catch (err) {
      setError(
        'Failed to add course: ' + (err.response?.data?.message || err.message)
      );
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold">Add Course</h1>
        <button
          type="submit"
          form="add-course-form"
          className="rounded-md border border-gray-400 px-6 py-2 font-semibold hover:bg-gray-100 w-full sm:w-auto"
        >
          Add
        </button>
      </div>

      {message && (
        <p className="mb-4 rounded-md bg-green-100 p-3 text-center text-xs sm:text-sm text-green-700" role="status" aria-live="polite">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-xs sm:text-sm text-red-700" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <form id="add-course-form" onSubmit={handleSubmit} className="space-y-6">
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
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-white hover:border-primary hover:shadow-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
          />
        </div>
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
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-white hover:border-primary hover:shadow-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
          />
        </div>
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-white hover:border-primary hover:shadow-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
          />
        </div>
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
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            required
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-white hover:border-primary hover:shadow-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30"
          />
        </div>
        <div>
          <label
            htmlFor="thumbnail"
            className="block text-base sm:text-lg font-medium text-gray-700"
          >
            Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required
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
        </div>
      </form>
    </div>
  );
}
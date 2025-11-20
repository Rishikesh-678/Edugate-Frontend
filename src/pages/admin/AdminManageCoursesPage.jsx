import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getManagedCourses, toggleCourseVisibility } from '../../services/apiService.js';

export default function AdminManageCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const fetchCourses = () => {
    getManagedCourses()
      .then((res) => {
        const data = res.data || res;
        setCourses(data);
        setFilteredCourses(data);
      })
      .catch(() => setError('Failed to fetch courses.'));
  };

  useEffect(fetchCourses, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = courses.filter(
      (course) =>
        course.courseName.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  const handleToggle = async (courseId) => {
    setTogglingId(courseId);
    try {
      await toggleCourseVisibility(courseId);
      fetchCourses(); // Refresh list
    } catch (err) {
      alert('Failed to toggle visibility.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-primary hover:text-orange-600 font-medium transition-colors"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="mb-8 text-2xl sm:text-3xl font-bold">Manage Approved Courses</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or instructor..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full sm:w-96 rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Course Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredCourses.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-600">No courses found.</td></tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.id} className={course.status === 'HIDDEN' ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 font-medium text-gray-900">{course.courseName}</td>
                  <td className="px-6 py-4 text-gray-700">{course.instructor}</td>
                  <td className="px-6 py-4 text-gray-700">{course.category}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      course.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggle(course.id)}
                      disabled={togglingId === course.id}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        course.status === 'APPROVED'
                          ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {togglingId === course.id ? '...' : (course.status === 'APPROVED' ? 'Hide' : 'Unhide')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
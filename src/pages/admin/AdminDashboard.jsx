import React, { useState, useEffect } from 'react';
import {
  getPendingCourses,
  approveCourse,
  rejectCourse,
} from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');

  const fetchPending = () => {
    getPendingCourses()
      .then((res) => setPending(res.data))
      .catch(() => setError('Failed to fetch pending courses.'));
  };

  useEffect(fetchPending, []);

  const handleApprove = async (id) => {
    try {
      await approveCourse(id);
      fetchPending(); // Refresh list
    } catch (err) {
      alert('Failed to approve.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCourse(id);
      fetchPending(); // Refresh list
    } catch (err) {
      alert('Failed to reject.');
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      {/* Banner with Background Image */}
      <div
        className="mb-12 sm:mb-16 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat relative h-64 sm:h-80 bg-gradient-to-r from-red-500 to-red-600"
        style={{
          backgroundImage:
            'url("/banners/admin-dashboard-banner.jpg")',
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full p-6 sm:p-8 md:flex-row md:p-12">
          <div className="text-center md:text-left">
            <h1 className="text-xl sm:text-3xl font-bold text-white">
              Welcome {user?.fullName || 'Admin'} 👋
            </h1>
          </div>
        </div>
      </div>

      <h2 className="mb-8 text-2xl sm:text-3xl font-bold">Pending Requests..</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Course Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pending.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No pending requests.
                </td>
              </tr>
            )}
            {pending.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {course.courseName}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {course.creatorEmail}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      course.status === 'PENDING_REMOVAL'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="space-x-2 px-6 py-4 text-right">
                  <button
                    onClick={() => handleApprove(course.id)}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(course.id)}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {pending.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending requests.
          </div>
        ) : (
          pending.map((course) => (
            <div key={course.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500">Course Name</p>
                <p className="text-base font-semibold text-gray-900 break-words">{course.courseName}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500">Instructor</p>
                <p className="text-sm text-gray-700 break-all">{course.creatorEmail}</p>
              </div>
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    course.status === 'PENDING_REMOVAL'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {course.status}
                </span>
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(course.id)}
                  className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(course.id)}
                  className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* TODO: Add Pagination controls */}
    </div>
  );
}
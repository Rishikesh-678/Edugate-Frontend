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
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">
        Welcome Admin {user?.fullName} 👋
      </h1>

      {/* Placeholder for Banner */}
      <div className="mb-16 h-48 rounded-lg bg-gray-200 p-8">
        Admin Dashboard Banner
      </div>

      <h2 className="mb-8 text-3xl font-bold">Pending Requests..</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto rounded-lg border">
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
                    className="font-medium text-green-600 hover:text-green-800"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(course.id)}
                    className="font-medium text-red-600 hover:text-red-800"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* TODO: Add Pagination controls */}
    </div>
  );
}
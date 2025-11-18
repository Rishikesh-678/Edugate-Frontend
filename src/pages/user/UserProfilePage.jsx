import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMyProfile, updateMyProfile, getLiveCourses } from '../../services/apiService.js';
import api from '../../services/apiService.js';
import CourseCard from '../../components/common/CourseCard.jsx';
import ChangePasswordModal from '../../components/auth/ChangePasswordModal.jsx';
import CourseCarousel from '../../components/common/CourseCarousel';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [adminLogsPage, setAdminLogsPage] = useState(0);
  const [adminLogsTotalPages, setAdminLogsTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const fetchSuggestions = () => {
    if (user?.role === 'ROLE_USER') {
      getLiveCourses()
        .then((res) => {
          setSuggestions(res.data || res || []);
        })
        .catch((err) => console.error('Failed to fetch suggestions:', err));
    }
    if (user?.role === 'ROLE_ADMIN') {
      api.get(`/admin/logs/me?page=${adminLogsPage}&size=10`)
        .then((res) => {
          // Handle nested response structure
          const responseData = res.data?.data || res.data;
          const logsData = responseData?.content || responseData?.data || [];
          
          // Get totalPages from the correct location
          let totalPages = responseData?.totalPages;
          if (!totalPages) {
            const totalElements = responseData?.totalElements || 0;
            totalPages = Math.ceil(totalElements / 10) || 1;
          }
          
          console.log('Admin logs response:', responseData);
          console.log('Total pages from response:', totalPages, 'Total elements:', responseData?.totalElements);
          
          setAdminLogs(Array.isArray(logsData) ? logsData : []);
          setAdminLogsTotalPages(Math.max(totalPages, 1));
        })
        .catch((err) => {
          console.error('Failed to fetch admin logs:', err);
          setAdminLogs([]);
          setAdminLogsTotalPages(1);
        });
    }
    setLoading(false);
  };



  useEffect(() => {
    // Fetch full profile details
    getMyProfile()
      .then((res) => {
        setFullName(res.data.fullName);
        setPhoneNumber(res.data.phoneNumber || '');
        fetchSuggestions();
      })
      .catch((err) => {
        console.error('Failed to fetch profile', err);
        setLoading(false);
      });
  }, [user?.role, adminLogsPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await updateMyProfile({ fullName, phoneNumber });
      setMessage('Profile updated successfully!');
      // Note: AuthContext user won't update fullName automatically.
      // You might need to add an `updateUser` function to AuthContext.
    } catch (error) {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-primary hover:text-orange-600 font-medium transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Public Profile</h1>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 md:col-span-2">
            {message && (
              <p className="rounded-md bg-green-100 p-3 text-sm text-green-700">
                {message}
              </p>
            )}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field-typing"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                readOnly
                className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field-typing"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-2 font-semibold text-black hover:bg-primary-dark"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                className="rounded-md border border-primary px-6 py-2 font-semibold text-primary hover:bg-primary hover:text-black transition-colors"
              >
                Change Password
              </button>
            </div>
          </form>

          {/* Avatar */}
          <div className="flex items-start justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-pink-600 text-8xl font-medium text-white">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </div>

        {/* Recommended Section (for ROLE_USER) */}
        {user?.role === "ROLE_USER" && (
          <>
            <h2 className="mb-8 mt-16 text-3xl font-bold">
              Recommended For You..
            </h2>
            {!loading && suggestions.length === 0 ? (
              <div className="py-8 text-center text-gray-600">
                No recommendations available.
              </div>
            ) : (
              <CourseCarousel courses={suggestions} />
            )}
          </>
        )}

        {/* Placeholder for Instructor/Admin sections on profile */}
        {user?.role === "ROLE_INSTRUCTOR" && (
          <h2 className="mb-8 mt-16 text-3xl font-bold">Most Subscribed..</h2>
        )}

        {/* Admin Logs Section */}
        {user?.role === "ROLE_ADMIN" && (
          <div className="mt-16">
            <h2 className="mb-8 text-3xl font-bold">
              Recently Viewed Requests..
            </h2>
            {!loading && (!adminLogs || adminLogs.length === 0) ? (
              <div className="py-8 text-center text-gray-600">
                No admin activities yet.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Array.isArray(adminLogs) &&
                        adminLogs.map((log, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                                {log.action?.replace(/_/g, " ") || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                                {log.targetType || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {log.details || `ID: ${log.targetId}`}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {log.createdAt
                                ? new Date(log.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      setAdminLogsPage(Math.max(0, adminLogsPage - 1))
                    }
                    disabled={adminLogsPage === 0}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <div className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                    Page {adminLogsPage + 1} of{" "}
                    {Math.max(1, adminLogsTotalPages)}
                  </div>
                  <button
                    onClick={() => setAdminLogsPage(adminLogsPage + 1)}
                    disabled={
                      adminLogsPage >= Math.max(1, adminLogsTotalPages) - 1
                    }
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
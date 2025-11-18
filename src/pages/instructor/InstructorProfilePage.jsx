import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMyProfile, updateMyProfile, getMyCourses } from '../../services/apiService.js';
import CourseCarousel from '../../components/common/CourseCarousel.jsx';
import ChangePasswordModal from '../../components/auth/ChangePasswordModal.jsx';

export default function InstructorProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const fetchMyCourses = () => {
    getMyCourses()
      .then((res) => {
        const coursesData = res.data || res || [];
        console.log('My courses:', coursesData);
        setMyCourses(Array.isArray(coursesData) ? coursesData : []);
      })
      .catch((err) => {
        console.error('Failed to fetch my courses:', err);
        setMyCourses([]);
      });
    setLoading(false);
  };

  useEffect(() => {
    // Fetch full profile details
    getMyProfile()
      .then((res) => {
        setFullName(res.data.fullName);
        setEmail(res.data.email);
        setPhoneNumber(res.data.phoneNumber || '');
        fetchMyCourses();
      })
      .catch((err) => {
        console.error('Failed to fetch profile', err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await updateMyProfile({ fullName, phoneNumber });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile.');
    }
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

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Public Profile</h1>
      </div>

      {/* Profile Section with Avatar */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 md:col-span-2">
          {message && (
            <p className={`rounded-md p-3 text-sm ${
              message.includes('successfully')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
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
            {user?.fullName?.charAt(0)?.toUpperCase() || 'I'}
          </div>
        </div>
      </div>

      {/* My Uploads Section */}
      <div className="mt-16">
        <h2 className="mb-8 text-3xl font-bold">My Uploads..</h2>
        {loading ? (
          <div className="py-8 text-center text-gray-600">Loading courses...</div>
        ) : myCourses.length === 0 ? (
          <div className="py-8 text-center text-gray-600">You haven't uploaded any courses yet.</div>
        ) : (
          <CourseCarousel courses={myCourses} />
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
      />
    </div>
  );
}

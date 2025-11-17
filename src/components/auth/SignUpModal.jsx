import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SignUpModal({ isOpen, onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register({ fullName, email, password, phoneNumber });
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sign Up With Email..
        </h2>
        {error && (
          <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signup-fullname"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="signup-fullname"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="signup-phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="signup-phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2.5 font-semibold text-black hover:bg-primary-dark"
          >
            Continue
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium text-primary hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
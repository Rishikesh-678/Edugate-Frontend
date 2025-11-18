import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  promoteUser,
  demoteUser,
} from '../../services/apiService.js'; // <-- Fixed path

export default function AdminManageUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = () => {
    getAllUsers()
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(() => setError('Failed to fetch users.'));
  };

  // Handle search from header
  useEffect(() => {
    const handleSearch = (event) => {
      const query = event.detail;
      setSearchQuery(query);
      filterUsers(query);
    };

    window.addEventListener('searchUsers', handleSearch);
    return () => window.removeEventListener('searchUsers', handleSearch);
  }, [users]);

  // Filter users based on search query
  const filterUsers = (query) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  };

  useEffect(fetchUsers, []);

  const handlePromote = async (id) => {
    try {
      await promoteUser(id);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert('Failed to promote.');
    }
  };

  const handleDemote = async (id) => {
    try {
      await demoteUser(id);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert('Failed to demote.');
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

      <h1 className="mb-8 text-3xl font-bold">Manage Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilteredUsers(users);
            }}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Clear Search
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-600">
                  {searchQuery ? 'No users found matching your search.' : 'No users available.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === 'ROLE_ADMIN'
                        ? 'bg-blue-100 text-blue-800'
                        : user.role === 'ROLE_INSTRUCTOR'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role.replace('ROLE_', '')}
                  </span>
                </td>
                <td className="space-x-2 px-6 py-4 text-right">
                  {user.role === 'ROLE_USER' && (
                    <button
                      onClick={() => handlePromote(user.id)}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      Promote
                    </button>
                  )}
                  {user.role === 'ROLE_INSTRUCTOR' && (
                    <button
                      onClick={() => handleDemote(user.id)}
                      className="font-medium text-orange-600 hover:text-orange-800"
                    >
                      Demote
                    </button>
                  )}
                  {user.role === 'ROLE_ADMIN' && (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* TODO: Add Pagination controls */}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import {
  getAllUsers,
  promoteUser,
  demoteUser,
} from '../../services/apiService.js'; // <-- Fixed path
import Breadcrumbs from '../../components/common/BreadCrumps.jsx'; // <-- NEW IMPORT

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // --- NEW BREADCRUMB DATA ---
  const breadcrumbs = [
    { name: 'Admin Dashboard', path: '/admin/dashboard' },
    { name: 'Manage Users' }, // Current page
  ];
  // ----------------------------

  const fetchUsers = () => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setError('Failed to fetch users.'));
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
      {/* --- ADD BREADCRUMBS HERE --- */}
      <div className="mb-6">
        <Breadcrumbs crumbs={breadcrumbs} />
      </div>
      {/* ----------------------------- */}

      <h1 className="mb-8 text-3xl font-bold">Manage Users</h1>
      {error && <p className="text-red-500">{error}</p>}
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
            {users.map((user) => (
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
            ))}
          </tbody>
        </table>
      </div>
      {/* TODO: Add Pagination controls */}
    </div>
  );
}
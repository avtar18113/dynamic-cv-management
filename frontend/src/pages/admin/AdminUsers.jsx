import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import CreateUserModal from './CreateUserModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
    const role = 'admin';
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost/cv-portal/backend/api/user/list', {
        withCredentials: true,
      });
      if (res.data.status) setUsers(res.data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await axios.post(
        'http://localhost/cv-portal/backend/api/user/delete',
        { id },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.status) {
        toast.success('User deleted');
        fetchUsers();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        <Topbar role={role} toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 mt-16 overflow-y-auto">
           <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          {/* <div className="p-6"> */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add User
              </button>
            </div>

            <div className="bg-white shadow rounded overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      {/* <td className="p-3">{user.email_verified 'Active'}</td> */}
                      <td className="p-3 text-right">
                        {/* Edit button can be added here */}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && !loading && (
                <div className="p-6 text-center text-gray-500">No users found.</div>
              )}
            </div>

            <CreateUserModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false);
                fetchUsers();
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
import React from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut, FiHelpCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Topbar = ({ role, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost/cv-portal/backend/api/logout', {}, { withCredentials: true });
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm z-10">
      {/* Left side - Menu button (only visible on mobile) */}
      <div className="flex-1 flex items-center lg:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Center - Title and role badge */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-lg font-bold text-gray-800 capitalize">
          {role === 'admin' ? 'Administrator' : 'Manager'} Dashboard
        </h1>
      </div>

      {/* Right side - Actions and user menu */}
      <div className="flex-1 flex items-center justify-end space-x-4">
        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors" aria-label="Help">
          <FiHelpCircle size={18} />
        </button>

        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full relative transition-colors" aria-label="Notifications">
          <FiBell size={18} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogout}>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUser className="text-blue-600" size={16} />
          </div>
          <div className="hidden md:block">
            <span className="text-sm font-medium text-gray-700">Logout</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

import React, { useState } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiUsers, 
  FiSettings, 
  FiBriefcase,
  FiChevronDown,
  FiChevronRight,
  FiLayers,
  FiUser,
  FiPieChart,
  FiMail,
  FiCalendar
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ role, isOpen, toggleSidebar }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleSubmenu = (menuKey) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const adminMenu = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: <FiHome size={20} />,
      path: '/admin/dashboard'
    },
    {
      key: 'projects',
      title: 'Projects',
      icon: <FiBriefcase size={20} />,
      path: '/admin/projects'
    },
    {
      key: 'cvManagement',
      title: 'CV Management',
      icon: <FiFileText size={20} />,
      submenu: [
        { title: 'All CVs', path: '/admin/cvs' },
        { title: 'Pending Review', path: '/admin/cvs/pending' },
        { title: 'Approved', path: '/admin/cvs/approved' },
        { title: 'Rejected', path: '/admin/cvs/rejected' }
      ]
    },
    {
      key: 'userManagement',
      title: 'User Management',
      icon: <FiUsers size={20} />,
      submenu: [
        { title: 'All Users', path: '/admin/users' },
        { title: 'Managers', path: '/admin/users/managers' },
        { title: 'Add New', path: '/admin/users/add' }
      ]
    },
    {
      key: 'reports',
      title: 'Reports',
      icon: <FiPieChart size={20} />,
      path: '/admin/reports'
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: <FiSettings size={20} />,
      path: '/admin/settings'
    }
  ];

  const managerMenu = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: <FiHome size={20} />,
      path: '/manager/dashboard'
    },
    {
      key: 'myProjects',
      title: 'My Projects',
      icon: <FiLayers size={20} />,
      submenu: [
        { title: 'Active Projects', path: '/manager/projects/active' },
        { title: 'Completed', path: '/manager/projects/completed' }
      ]
    },
    {
      key: 'cvSubmissions',
      title: 'CV Submissions',
      icon: <FiFileText size={20} />,
      submenu: [
        { title: 'All Submissions', path: '/manager/cvs' },
        { title: 'Pending Review', path: '/manager/cvs/pending' },
        { title: 'My Reviews', path: '/manager/cvs/reviews' }
      ]
    },
    {
      key: 'calendar',
      title: 'Calendar',
      icon: <FiCalendar size={20} />,
      path: '/manager/calendar'
    },
    {
      key: 'messages',
      title: 'Messages',
      icon: <FiMail size={20} />,
      path: '/manager/messages'
    }
  ];

  const menuItems = role === 'admin' ? adminMenu : managerMenu;

  return (
    <aside className={`
      fixed top-0 left-0 h-full bg-white border-r border-gray-200
      shadow-sm z-20 transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-20'}
    `}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {isOpen ? (
          <h1 className="text-xl font-bold text-blue-600 whitespace-nowrap">
            {role === 'admin' ? 'Admin Panel' : 'Manager Panel'}
          </h1>
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-2xl font-bold text-blue-600">{role === 'admin' ? 'AP' : 'MP'}</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-1 rounded-md hover:bg-gray-100 text-gray-500 ${!isOpen && 'mx-auto'}`}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Menu Items */}
      <nav className="p-2 overflow-y-auto h-[calc(100%-4rem)]">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    onMouseEnter={() => setHoveredItem(item.key)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg
                      transition-colors duration-200
                      ${!isOpen ? 'justify-center px-0' : 'px-3'}
                      ${(openSubmenus[item.key] || hoveredItem === item.key) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}
                    `}
                  >
                    <div className="flex items-center">
                      <span className={`${(openSubmenus[item.key] || hoveredItem === item.key) ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      {isOpen && (
                        <span className="ml-3 text-sm font-medium whitespace-nowrap">
                          {item.title}
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      openSubmenus[item.key] ? (
                        <FiChevronDown size={16} className="text-blue-600" />
                      ) : (
                        <FiChevronRight size={16} className="text-gray-400" />
                      )
                    )}
                  </button>
                  
                  {(!isOpen && hoveredItem === item.key) && (
                    <div className="fixed ml-20 bg-white shadow-lg rounded-md py-1 z-30 min-w-[200px] border border-gray-200">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.title}
                      </div>
                      {item.submenu.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          className={({ isActive }) => 
                            `block px-3 py-2 text-sm rounded-md mx-1 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`
                          }
                        >
                          {subItem.title}
                        </NavLink>
                      ))}
                    </div>
                  )}

                  {isOpen && openSubmenus[item.key] && (
                    <ul className="ml-2 mt-1 pl-7 border-l-2 border-blue-100 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) => 
                              `block px-3 py-2 text-sm rounded-lg transition-colors duration-150
                              ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`
                            }
                          >
                            {subItem.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors duration-200
                    ${!isOpen ? 'justify-center px-0' : 'px-3'}
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}
                    ${hoveredItem === item.key && !isActive ? 'bg-gray-50' : ''}`
                  }
                >
                  <span className={isActive => isActive ? 'text-blue-600' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  {isOpen && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                  {!isOpen && hoveredItem === item.key && (
                    <div className="fixed ml-20 bg-white shadow-md rounded-md py-1 px-3 z-30 text-sm font-medium whitespace-nowrap">
                      {item.title}
                    </div>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* User Profile Section */}
        <div className={`mt-6 border-t border-gray-200 pt-4 ${!isOpen && 'px-0'}`}>
          <div className={`flex items-center ${isOpen ? 'px-3' : 'justify-center'}`}>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUser className="text-blue-600" size={18} />
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">John Doe</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
import React, { useEffect, useState } from 'react';
import { fetchCVs, exportCSV, exportZip } from '../../services/api';
import CVTable from '../../components/CVTable';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { FiDownload, FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

const ManagerDashboard = () => {
  const [cvs, setCVs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const role = 'manager';

  useEffect(() => {
    fetchCVs().then(res => {
      if (res.data.status) {
        setCVs(res.data.data);
      }
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleExportCSV = async () => {
    const res = await exportCSV();
    const blob = new Blob([res.data], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'cv_submissions.csv';
    link.click();
  };

  const handleZipDownload = () => {
    const projectId = prompt("Enter Project ID to download all PDFs:");
    if (projectId) {
      exportZip(projectId).then(res => {
        const blob = new Blob([res.data], { type: 'application/zip' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `cv_project_${projectId}.zip`;
        link.click();
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        <Topbar role={role} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Manager!</h2>
            <p className="mt-2 text-gray-600 text-center">
              Manage your assigned projects and CV reviews from this dashboard.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned Projects</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-800">5</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiFileText size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-800">12</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FiClock size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Reviews</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-800">34</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiCheckCircle size={20} />
                </div>
              </div>
            </div>
          </div>
          
          {/* CV Management Section */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
                Your Assigned CV Submissions
              </h3>
              <div className="flex space-x-2">
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  <FiDownload className="mr-2" size={16} />
                  Export CSV
                </button>
                <button 
                  onClick={handleZipDownload}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  <FiDownload className="mr-2" size={16} />
                  Download ZIP
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <CVTable cvs={cvs} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
import React, { useEffect, useState } from 'react';
import { fetchCVs, exportCSV, exportZip } from '../../services/api';
import CVList from '../../components/CVList';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { FiDownload, FiFileText, FiUsers, FiBriefcase } from 'react-icons/fi';

const AdminProjectCV = () => {
  const [cvs, setCVs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const role = 'admin';

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
          {/* CV Management Section */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                CV Submissions List
              </h3>
              <p className="text-sm font-bold text-gray-600 mb-4">
              Manage and review CV submissions for all projects.</p>
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
              <CVList cvs={cvs} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProjectCV;
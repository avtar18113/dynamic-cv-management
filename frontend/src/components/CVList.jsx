import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CVList = () => {
  const [cvList, setCVList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedCV, setSelectedCV] = useState(null);


  useEffect(() => {
    fetchCVs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedProject, cvList]);

  const fetchCVs = async () => {
    try {
      const res = await axios.get('http://localhost/cv-portal/backend/api/cv/list', {
        withCredentials: true
      });
      if (res.data.status) {
        setCVList(res.data.data);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage('Failed to load CVs');
    }
  };

  const applyFilters = () => {
    const lowerSearch = searchTerm.toLowerCase();
    const result = cvList.filter(cv => {
      const matchesSearch = (
        cv.user_name?.toLowerCase().includes(lowerSearch) ||
        cv.project_name?.toLowerCase().includes(lowerSearch) ||
        cv.data?.email?.toLowerCase().includes(lowerSearch)
      );
      const matchesProject = selectedProject ? cv.project_name === selectedProject : true;
      return matchesSearch && matchesProject;
    });
    setFilteredList(result);
  };

  const downloadCSV = () => {
    window.open('http://localhost/cv-portal/backend/api/cv/export/csv', '_blank');
  };

  const downloadPDF = (id) => {
    window.open(`http://localhost/cv-portal/backend/api/admincv/download/pdf?id=${id}`);
  };

  const uniqueProjects = [...new Set(cvList.map(cv => cv.project_name))];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by user, project, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:max-w-sm"
        />
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:max-w-sm"
        >
          <option value="">All Projects</option>
          {uniqueProjects.map((project, i) => (
            <option key={i} value={project}>{project}</option>
          ))}
        </select>
        <button
          onClick={downloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {message && <p className="text-red-600">{message}</p>}

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Project</th>
              <th className="px-4 py-2 border">Submitted</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((cv, index) => (
              <tr key={cv.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{cv.user_name}</td>
                <td className="px-4 py-2 border">{cv.project_name}</td>
                <td className="px-4 py-2 border">{new Date(cv.submitted_at).toLocaleString()}</td>                
                <td className="px-4 py-2 border space-x-2">
                  <button onClick={() => downloadPDF(cv.id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">PDF</button>
                  <button onClick={() => setSelectedCV(cv)} className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700" > View </button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">No CVs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
            {selectedCV && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-2xl p-6 rounded-md relative shadow-xl overflow-y-auto max-h-[90vh]">
      <h2 className="text-xl font-semibold mb-4">CV Details</h2>
      <button
        onClick={() => setSelectedCV(null)}
        className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
      >
        &times;
      </button>

      <div className="space-y-2">
        {selectedCV.data &&
          Object.entries(selectedCV.data).map(([key, value]) => (
            <div key={key}>
              <p className="text-sm font-semibold capitalize">{key.replace(/_/g, ' ')}:</p>
              <p className="text-gray-800 text-sm">{value}</p>
              
            </div>
          ))}

        {selectedCV.data.photo_url && (
          <div className="mt-4">       
            <p className="text-sm font-semibold">Uploaded Photo:</p>
            <img
              src={`http://localhost/cv-portal/backend/${selectedCV.data.photo_url}`}
              alt="User Photo"
              className="w-100 h-auto object-cover border rounded mt-2"
            />
          </div>
         )} 
      </div>
    </div>
  </div>
)}


    </div>
    

  );
};

export default CVList;

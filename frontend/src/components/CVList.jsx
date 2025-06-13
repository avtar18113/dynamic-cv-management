import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CVList = () => {
  const [cvList, setCVList] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCVs();
  }, []);

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

  const downloadCSV = () => {
    window.open('http://localhost/cv-portal/backend/api/cv/export/csv', '_blank');
  };

  const downloadPDF = (id) => {
    window.open(`http://localhost/cv-portal/backend/api/admincv/download/pdf?id=${id}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">     

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
            {cvList.map((cv, index) => (
              <tr key={cv.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{cv.user_name}</td>
                <td className="px-4 py-2 border">{cv.project_name}</td>
                <td className="px-4 py-2 border">{cv.submitted_at}</td>
               
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => downloadPDF(cv.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
            {cvList.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">No CVs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CVList;

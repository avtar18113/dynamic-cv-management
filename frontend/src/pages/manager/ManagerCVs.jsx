import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

const ManagerCVs = () => {
  const [cvs, setCVs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/cv-portal/backend/api/cv/list', { withCredentials: true })
      .then(res => {
        if (res.data.status) setCVs(res.data.data);
      })
      .catch(err => console.error('CV Load Error', err));
  }, []);

  return (
    <div className="flex">
      <Sidebar role="manager" />
      <div className="flex-1 ml-64">
        <Topbar role="manager" />
        <main className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-xl font-bold mb-4">Submitted CVs</h2>
          <table className="w-full bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <th className="p-3">User ID</th>
                <th className="p-3">Project</th>
                <th className="p-3">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {cvs.map(cv => (
                <tr key={cv.id} className="border-t text-sm">
                  <td className="p-3">{cv.user_id}</td>
                  <td className="p-3">{cv.project_id}</td>
                  <td className="p-3">{cv.submitted_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default ManagerCVs;

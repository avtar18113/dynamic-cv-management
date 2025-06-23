import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiDownload, FiEye } from 'react-icons/fi';

const AdminCVList = () => {
  const [cvList, setCVList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCVs();
  }, []);

  

  const fetchCVs = async () => {
    try {
      const res = await axios.get('http://localhost/cv-portal/backend/api/cv/list', {
        withCredentials: true,
      });
      if (res.data.status) {
        setCVList(res.data.data);
        setFiltered(res.data.data);
      } else {
        toast.error('Failed to fetch CVs');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const result = cvList.filter(cv =>
      cv.name?.toLowerCase().includes(term) || cv.email?.toLowerCase().includes(term)
    );
    setFiltered(result);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">CV Submissions</h2>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name/email"
          className="border p-2 rounded w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Submitted At</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cv, idx) => (
              <tr key={cv.id} className="border-t">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{cv.name || '-'}</td>
                <td className="p-3">{cv.email || '-'}</td>
                <td className="p-3">{cv.created_at}</td>
                <td className="p-3 text-right space-x-2">
                  <button className="text-blue-600 hover:underline">
                    <FiEye /> View
                  </button>
                  <a
                    href={`http://localhost/cv-portal/backend/api/admincv/download/pdf?id=${cv.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    <FiDownload /> PDF
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No CVs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCVList;

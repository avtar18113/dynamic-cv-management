import React from 'react';
import {
  FiUser,
  FiMail,
  FiClock,
  FiFileText,
  FiDownload,
  FiSearch,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

const CVTable = ({ cvs }) => {
  if (!cvs.length) return <p>No submissions found.</p>;

  const fieldNames = Object.keys(cvs[0]?.data || {});

  return (
    <>
    <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-black-500 uppercase tracking-wider">Project</th>
          <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-black-500 uppercase tracking-wider">User</th>
          <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-black-500 uppercase tracking-wider">Email</th>
          {fieldNames.map((key) => (
            <th className="px-2 py-2 text-left text-xs font-medium text-black-500 uppercase tracking-wider" key={key}>{key}</th>
          ))}
          <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-black-500 uppercase tracking-wider">Submitted At</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-300">
        {cvs.map((cv) => (
          <tr key={cv.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-2 py-2 whitespace-nowrap">{cv.project_name}</td>
            <td className="px-2 py-2 whitespace-nowrap">{cv.user_name}</td>
            <td className="px-2 py-2 whitespace-nowrap">{cv.email}</td>
            {fieldNames.map((key) => (
              <td className="px-2 py-2 whitespace-nowrap" key={key}>{cv.data[key]}</td>
            ))}
            <td className="px-2 py-2 whitespace-nowrap">{new Date(cv.submitted_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  );
};

export default CVTable;

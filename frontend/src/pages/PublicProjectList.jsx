import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PublicProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/cv-portal/backend/api/project/public-list')
      .then(res => {
        if (res.data.status) {
          setProjects(res.data.data);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Open Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition">
            {project.logo && (
              <img src={`http://localhost/cv-portal/backend/${project.logo}`} alt={project.name} className="h-20 mx-auto mb-3" />
            )}
            <h3 className="text-xl font-bold text-gray-800 mb-1 text-center">{project.name}</h3>
            <p className="text-sm text-gray-500 text-center">
              {project.start_date} → {project.end_date}
            </p>
            <div className="text-center mt-4">
              <Link
                to={`project/${project.id}/cv-form`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                Submit CV
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicProjectList;

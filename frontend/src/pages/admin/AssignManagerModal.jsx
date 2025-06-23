import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignManagerModal = ({ onClose, onSuccess }) => {
  const [managers, setManagers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch active managers
  const fetchManagers = async () => {
    try {
      const res = await axios.get('http://localhost/cv-portal/backend/api/manager/list', {
        withCredentials: true,
      });
      
      if (res.data.status) {
        setManagers(res.data.data);
      } else {
        toast.error('Failed to load managers');
      }
    } catch {
      toast.error('Server error loading managers');
    }
  };

  // Fetch active projects
  const fetchProjects = async () => {
  try {
    const res = await axios.get('http://localhost/cv-portal/backend/api/project/list', {
      withCredentials: true,
    });

    if (res.data.status) {
      const activeProjects = res.data.data.filter(project => project.is_active === 1);
      setProjects(activeProjects);
    } else {
      toast.error('Failed to load projects');
    }
  } catch {
    toast.error('Server error loading projects');
  }
};

  useEffect(() => {
    fetchManagers();
    fetchProjects();
  }, []);

  const handleAssign = async () => {
    if (!selectedManager || !selectedProject) {
      toast.error('Please select both manager and project');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost/cv-portal/backend/api/project/assign-manager',
        { manager_id: selectedManager, project_id: selectedProject },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.status) {
        toast.success('Manager assigned successfully');
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data.message || 'Assignment failed');
      }
    } catch (err) {
      toast.error('Server error assigning manager');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Assign Manager to Project</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Select Manager</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
            >
              <option value="">-- Select --</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Select Project</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">-- Select --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAssign}
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-md ${
              loading ? 'opacity-50' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Assigning...' : 'Assign Manager'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignManagerModal;

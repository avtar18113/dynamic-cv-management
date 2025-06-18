import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminCreateProject = ({ editData = null, onSuccess }) => {
  const [form, setForm] = useState({
    id: '',
  name: '',
  slug: '',
  logo_url: '',
  header_image: '',
  start_date: '',
  end_date: ''
  });

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id || '',
        name: editData.name || '',
        slug: editData.slug || '',
        logo_url: editData.logo_url || '',
        header_image: editData.header_image || '',
        start_date: editData.start_date || '',
        end_date: editData.end_date || ''
      });
    } else {
      // Reset form if adding new project
      setForm({
        id:'',
        name: '',
        slug: '',
        logo_url: '',
        header_image: '',
        start_date: '',
        end_date: ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = editData
      ? 'http://localhost/cv-portal/backend/api/project/update'
      : 'http://localhost/cv-portal/backend/api/project/create';

    try {

      const res = await axios.post(endpoint, form, { withCredentials: true });

      if (res.data.status) {
        toast.success(editData ? 'Project updated successfully' : 'Project created successfully');
        if (onSuccess) onSuccess(editData ? 'updated' : 'created');
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Project submission error:', err);
      toast.error('Failed to submit project');
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        {editData ? 'Edit Project' : 'Create New Project'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'slug', 'logo_url', 'header_image'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize font-medium">
              {field.replace('_', ' ')}
            </label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editData ? 'Update Project' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateProject;

import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateProject = () => {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    logo_url: '',
    header_image: '',
    start_date: '',
    end_date: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost/cv-portal/backend/api/project/create',
        form,
        { withCredentials: true }
      );
      if (res.data.status) {
        setMessage('✅ Project created successfully!');
        setForm({
          name: '',
          slug: '',
          logo_url: '',
          header_image: '',
          start_date: '',
          end_date: ''
        });
      } else {
        setMessage('❌ ' + res.data.message);
      }
    } catch (err) {
      setMessage('❌ Failed to create project');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'slug', 'logo_url', 'header_image'].map(field => (
          <div key={field}>
            <label className="block mb-1 capitalize font-medium">{field.replace('_', ' ')}</label>
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
          Create Project
        </button>

        {message && <p className="mt-4 text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default AdminCreateProject;

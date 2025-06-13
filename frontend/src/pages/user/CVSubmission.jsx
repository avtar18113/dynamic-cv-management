import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CVSubmission = () => {
  const { projectId } = useParams();
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost/cv-portal/backend/api/cv/field/list?project_id=${projectId}`)
      .then((res) => {
        if (res.data.status) {
          setFields(res.data.data);
          // Initialize form state
          const initialData = {};
          res.data.data.forEach(field => {
            const key = field.field_name.toLowerCase().replace(/\s+/g, '_');
            initialData[key] = '';
          });

          setFormData(initialData);
        }
      });
  }, [projectId]);

  const handleChange = (e) => {
    const key = e.target.name;
    setFormData(prev => ({ ...prev, [key]: e.target.value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      project_id: parseInt(projectId),
      data: formData
    };
    try {
      const res = await axios.post(
        'http://localhost/cv-portal/backend/api/cv/submit',
        payload,
        { withCredentials: true }
      );
      if (res.data.status) {
        setMessage('CV Submitted Successfully!');
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage('Submission failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-md w-full max-w-2xl"
      >
        <h2 className="text-2xl font-semibold mb-6">CV Submission Form</h2>
        {fields.map(field => {
          const key = field.field_name.toLowerCase().replace(/\s+/g, '_');
          return (
            <div key={field.id} className="mb-4">
              <label className="block mb-1 text-gray-700 text-sm font-medium">
                {field.field_name}
              </label>
              <input
                type={field.field_type || 'text'}
                name={key}
                required={field.is_required === 1}
                value={formData[key] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>
          );
        })}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default CVSubmission;

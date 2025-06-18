import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const CVSubmission = () => {
  const { projectId } = useParams();
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost/cv-portal/backend/api/cv/field/list?project_id=${projectId}`)
      .then((res) => {
        if (res.data.status) {
          setFields(res.data.data);
          const initialData = {};
          res.data.data.forEach((field) => {
            const key = field.field_name.toLowerCase().replace(/\s+/g, '_');
            initialData[key] = '';
          });
          setFormData(initialData);
        } else {
          toast.error('Failed to load form fields');
        }
      })
      .catch(() => toast.error('Server error loading fields'));
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG or JPEG files are allowed.');
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 2MB.');
      return;
    }

    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append('project_id', projectId);
    payload.append('form_data', JSON.stringify(formData));
    if (photo) payload.append('photo', photo);

    try {
      const res = await axios.post(
        'http://localhost/cv-portal/backend/api/cv/submit',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (res.data.status) {
        toast.success('CV Submitted Successfully!');
        setFormData({});
        setPhoto(null);
      } else {
        toast.error(res.data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const key = field.field_name.toLowerCase().replace(/\s+/g, '_');
    const isRequired = field.is_required === 1;

    switch (field.field_type) {
      case 'textarea':
        return (
          <textarea
            name={key}
            required={isRequired}
            value={formData[key] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        );

      case 'dropdown':
        return (
          <select
            name={key}
            required={isRequired}
            value={formData[key] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select...</option>
            {Array.isArray(field.options) && field.options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            name={key}
            required={isRequired}
            value={formData[key] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            name={key}
            required={isRequired}
            value={formData[key] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        );

      case 'file':
        return (
          <input
            type="file"
            name={key}
            required={isRequired}
            onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.files[0] }))}
            className="w-full"
          />
        );

      default:
        return (
          <input
            type="text"
            name={key}
            required={isRequired}
            value={formData[key] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">CV Submission Form</h2>

        {fields.map(field => (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.field_name}
            </label>
            {renderField(field)}
          </div>
        ))}

        {/* Photo Upload Preview */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {photo && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(photo)}
                alt="Preview"
                className="h-24 rounded border border-gray-300"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit CV'}
        </button>
      </form>
    </div>
  );
};

export default CVSubmission;

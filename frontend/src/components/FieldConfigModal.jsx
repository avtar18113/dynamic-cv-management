import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FieldConfigModal = ({ projectId, onClose }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchFields();
    }
  }, [projectId]);

  const fetchFields = async () => {
    try {
      const res = await axios.get(`http://localhost/cv-portal/backend/api/cv/field/list?project_id=${projectId}`);
      if (res.data.status) setFields(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load fields");
    }
  };

  const handleAddField = () => {
    setFields(prev => [
      ...prev,
      {
        field_name: '',
        field_type: 'text',
        is_required: false,
        min_length: 0,
        max_length: 255,
        options:'',
        order: prev.length + 1
      }
    ]);
  };

  const handleChange = (index, key, event) => {
    const value = key === 'required' ? event.target.checked : event.target.value;
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleSave = async () => {
    try {
      const payload = {
        project_id: projectId,
        fields: fields
      };

      const res = await axios.post(
        'http://localhost/cv-portal/backend/api/cv/field/add',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.data.status) {
        toast.success("Fields saved successfully");
        onClose();
      } else {
        toast.error(res.data.message || "Failed to save fields");
      }
    } catch (err) {
      toast.error("Save failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4">Configure Fields</h3>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {fields.map((field, idx) => (
            <div key={idx} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Label"
                value={field.field_name}
                onChange={(e) => handleChange(idx, 'field_name', e)}
              />
              <select
                className="border p-2 rounded"
                value={field.field_type}
                onChange={(e) => handleChange(idx, 'field_type', e)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="file">File</option>
                <option value="textarea">Textarea</option>
                <option value="dropdown">Dropdown</option>                
              </select>
              {field.field_type === 'dropdown' && (
  <div className="col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma-separated)</label>
    <input
      type="text"
      className="border p-2 rounded w-full"
      placeholder="e.g. Option1, Option2, Option3"
      value={field.options || ''}
      onChange={(e) => handleChange(idx, 'options', e)}
    />
  </div>
)}

{field.field_type === 'textarea' && (
  <textarea className="border p-2 rounded w-full" disabled placeholder="Textarea preview" />
)}

{field.field_type === 'file' && (
  <input type="file" className="border p-2 rounded w-full" disabled />
)}

{field.field_type === 'dropdown' && field.options && (
  <select className="border p-2 rounded w-full" disabled>
    {field.options.split(',').map((opt, i) => (
      <option key={i} value={opt.trim()}>{opt.trim()}</option>
    ))}
  </select>
)}


              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Min"
                value={field.min_length}
                onChange={(e) => handleChange(idx, 'min_length', e)}
              />
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Max"
                value={field.max_length}
                onChange={(e) => handleChange(idx, 'max_length', e)}
              />
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Order"
                value={field.order}
                onChange={(e) => handleChange(idx, 'order', e)}
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={field.is_required}
                  onChange={(e) => handleChange(idx, 'is_required', e)}
                />
                Required
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleAddField}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            + Add Field
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldConfigModal;

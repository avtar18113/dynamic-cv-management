import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(
        'http://localhost/cv-portal/backend/api/register',
        form,
        { withCredentials: true }
      );
      if (res.data.status) {
        setMessage('Registered successfully. Please check your email to verify your account.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          User Registration
        </h2>

        {['name', 'email', 'password'].map(field => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-700 mb-1 capitalize">
              {field}
            </label>
            <input
              type={field === 'password' ? 'password' : field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Register
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-green-600">{message}</p>
        )}

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;

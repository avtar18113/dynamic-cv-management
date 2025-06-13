import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { useAuth } from '../contexts/AuthContext'; // Uncomment if using AuthContext for login state
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg('');

    try {
      const res = await axios.post(
        'http://localhost/cv-portal/backend/api/login',
        { email, password },
        { withCredentials: true }
      );
      login(res.data.data);
      if (res.data.status) {
        const role = res.data.data.role;
        localStorage.setItem('role', role);

        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'manager') navigate('/manager/dashboard');
        else if (role === 'user') navigate('/project/:projectId/cv-form');
        else setErrMsg('Access denied: unknown role.');
      } else {
        setErrMsg(res.data.message);
      }
    } catch (error) {
        console.log("Axios error:", error);
        setErrMsg('Login failed. Server error or invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">CV Portal Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-semibold">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errMsg && <p className="text-red-600 text-sm">{errMsg}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

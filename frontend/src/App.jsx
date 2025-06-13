import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProjects from './pages/admin/AdminProjects';
import ManagerCVs from './pages/manager/ManagerCVs';
import CVSubmission from './pages/user/CVSubmission';
import Home from './Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project/:projectId/cv-form" element={<CVSubmission />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/cvs"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerCVs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

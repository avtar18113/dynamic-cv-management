import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectsCV1 from './pages/admin/AdminProjectsCV1';
import ManagerCVs from './pages/manager/ManagerCVs';
import CVSubmission from './pages/user/CVSubmission';
import Home from './Home';
import AdminCreateProject from './components/AdminCreateProject';

import AdminProjectCV from './pages/admin/AdminProjectsCV';

import Register from './pages/Register';
import PublicProjectList from './pages/PublicProjectList';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<PublicProjectList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/project/:projectId/cv-form" element={<CVSubmission />} />
        <Route path="/admin/create-project" element={<AdminCreateProject />} />
        <Route path="/admin/cvs" element={<AdminProjectCV />} />  
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projectsCV1"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProjectsCV1 />
            </ProtectedRoute>
          }
        />
        

        <Route path="/manager/dashboard" element={
          <ProtectedRoute role="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        } />
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

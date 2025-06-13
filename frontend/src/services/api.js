import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost/cv-portal/backend',
  withCredentials: true
});

export const fetchCVs = () => API.get('/api/cv/list');
export const exportCSV = () => API.get('/api/cv/export/csv', { responseType: 'blob' });
export const exportZip = (projectId) =>
  API.get(`/api/cv/export/zip/pdf?project_id=${projectId}`, { responseType: 'blob' });

export default API;

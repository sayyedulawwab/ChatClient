import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5223/api', // Replace with your API base URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

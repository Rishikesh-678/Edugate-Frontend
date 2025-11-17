import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api', // The proxy will handle this
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Request Interceptor:
  Checks for a token in localStorage and adds it to the
  Authorization header if it exists.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
  Response Interceptor:
  Catches 401 Unauthorized errors (e.g., token expired)
  and automatically logs the user out.
*/
api.interceptors.response.use(
  (response) => {
    // Return the response data (which is wrapped in a `data` property by our backend)
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      // Reload the window to clear all state and redirect to login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/*
  Helper function for multipart/form-data (file uploads)
*/
const apiFormData = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

apiFormData.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiFormData.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// --- API Function Exports ---

export default api;

// You can also export specific functions for each endpoint

// --- Public / User ---
export const getLiveCourses = () => api.get('/user/courses');
export const getMySubscriptions = () => api.get('/user/courses/my-subscriptions');
export const subscribeToCourse = (courseId) =>
  api.post(`/user/courses/subscribe/${courseId}`);
export const unsubscribeFromCourse = (courseId) =>
  api.delete(`/user/courses/unsubscribe/${courseId}`);
export const getMyProfile = () => api.get('/user/profile/me');
export const updateMyProfile = (profileData) =>
  api.put('/user/profile/me', profileData);

// --- Instructor ---
export const getMyCourses = () => api.get('/instructor/courses/my-courses');
export const requestCourseRemoval = (courseId) =>
  api.delete(`/instructor/courses/${courseId}`);
export const addCourse = (formData) =>
  apiFormData.post('/instructor/courses', formData);

// --- Admin ---
export const getAllUsers = () => api.get('/admin/users');
export const promoteUser = (userId) =>
  api.put(`/admin/users/promote/${userId}`);
export const demoteUser = (userId) =>
  api.put(`/admin/users/demote/${userId}`);
export const getPendingCourses = () => api.get('/admin/courses/pending');
export const approveCourse = (courseId) =>
  api.post(`/admin/courses/approve/${courseId}`);
export const rejectCourse = (courseId) =>
  api.post(`/admin/courses/reject/${courseId}`);
export const getAdminLogs = (page = 0, size = 10) =>
  api.get(`/admin/logs/me?page=${page}&size=${size}`);
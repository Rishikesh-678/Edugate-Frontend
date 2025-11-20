import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api', // The proxy will handle this
  timeout: 10000, // 10 second timeout
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
      // BUT: Don't reload if it's a failed login attempt (which also returns 401)
      const isLoginRequest = error.config && error.config.url === '/auth/login';

      if (!isLoginRequest) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        // Reload the window to clear all state and redirect to login
        window.location.href = '/';
      }
    }
    // Return the error with a fallback message if no response
    if (!error.response) {
      console.error('Network error or backend unavailable:', error.message);
      return Promise.reject({
        response: {
          data: {
            message: 'Backend server is unavailable. Please try again later.',
          },
        },
      });
    }
    return Promise.reject(error);
  }
);

/*
  Helper function for multipart/form-data (file uploads)
*/
const apiFormData = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 second timeout for file uploads
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
    // Return the error with a fallback message if no response
    if (!error.response) {
      console.error('Network error or backend unavailable:', error.message);
      return Promise.reject({
        response: {
          data: {
            message: 'Backend server is unavailable. Please try again later.',
          },
        },
      });
    }
    return Promise.reject(error);
  }
);

// --- API Function Exports ---

export default api;

// You can also export specific functions for each endpoint

// --- Public / User ---
export const getLiveCourses = () => api.get('/public/courses');
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
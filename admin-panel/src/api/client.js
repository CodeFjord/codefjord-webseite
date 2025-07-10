import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Axios instance mit Auth-Token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor für Auth-Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor für Auth-Fehler und Rolling Token Refresh
apiClient.interceptors.response.use(
  (response) => {
    // Rolling Session: Prüfe auf neuen Token im Header
    const refreshToken = response.headers['x-refresh-token'];
    if (refreshToken) {
      localStorage.setItem('token', refreshToken);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (data) => apiClient.put('/auth/password', data),
};

// Portfolio API
export const portfolioAPI = {
  getAll: () => apiClient.get('/portfolio'),
  getById: (id) => apiClient.get(`/portfolio/${id}`),
  create: (data) => apiClient.post('/portfolio', data),
  update: (id, data) => apiClient.put(`/portfolio/${id}`, data),
  delete: (id) => apiClient.delete(`/portfolio/${id}`),
  uploadImage: (formData) => apiClient.post('/portfolio/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Blog API
export const blogAPI = {
  getAll: () => apiClient.get('/blog'),
  getById: (id) => apiClient.get(`/blog/${id}`),
  create: (data) => apiClient.post('/blog', data),
  update: (id, data) => apiClient.put(`/blog/${id}`, data),
  delete: (id) => apiClient.delete(`/blog/${id}`),
  uploadImage: (formData) => apiClient.post('/blog/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Pages API
export const pagesAPI = {
  getAll: () => apiClient.get('/pages'),
  getById: (id) => apiClient.get(`/pages/${id}`),
  getBySlug: (slug) => apiClient.get(`/pages/slug/${slug}`),
  create: (data) => apiClient.post('/pages', data),
  update: (id, data) => apiClient.put(`/pages/${id}`, data),
  delete: (id) => apiClient.delete(`/pages/${id}`),
};

// Contact API
export const contactAPI = {
  getAll: () => apiClient.get('/contact'),
  getById: (id) => apiClient.get(`/contact/${id}`),
  update: (id, data) => apiClient.put(`/contact/${id}`, data),
  delete: (id) => apiClient.delete(`/contact/${id}`),
  reply: (id, data) => apiClient.post(`/contact/${id}/reply`, data),
};

// Media API
export const mediaAPI = {
  getAll: () => apiClient.get('/media'),
  getById: (id) => apiClient.get(`/media/${id}`),
  upload: (formData) => apiClient.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => apiClient.put(`/media/${id}`, data),
  delete: (id) => apiClient.delete(`/media/${id}`),
};

// Menus API
export const menusAPI = {
  getAll: () => apiClient.get('/menus'),
  getById: (id) => apiClient.get(`/menus/${id}`),
  create: (data) => apiClient.post('/menus', data),
  update: (id, data) => apiClient.put(`/menus/${id}`, data),
  delete: (id) => apiClient.delete(`/menus/${id}`),
  createItem: (menuId, data) => apiClient.post(`/menus/${menuId}/items`, data),
  updateItem: (id, data) => apiClient.put(`/menus/items/${id}`, data),
  deleteItem: (id) => apiClient.delete(`/menus/items/${id}`),
};

// Menu Items API
export const menuItemsAPI = {
  getAll: (menuId) => apiClient.get(`/menus/${menuId}/items`),
  getById: (id) => apiClient.get(`/menus/items/${id}`),
  create: (menuId, data) => apiClient.post(`/menus/${menuId}/items`, data),
  update: (id, data) => apiClient.put(`/menus/items/${id}`, data),
  delete: (id) => apiClient.delete(`/menus/items/${id}`),
  reorder: (menuId, items) => apiClient.put(`/menus/${menuId}/items/reorder`, { items }),
};

// Team Members API
export const teamMembersAPI = {
  getAll: () => apiClient.get('/team-members'),
  getById: (id) => apiClient.get(`/team-members/${id}`),
  create: (data) => apiClient.post('/team-members', data),
  update: (id, data) => apiClient.put(`/team-members/${id}`, data),
  delete: (id) => apiClient.delete(`/team-members/${id}`),
  uploadImage: (formData) => apiClient.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Users API
export const usersAPI = {
  getAll: () => apiClient.get('/auth/users'),
  getById: (id) => apiClient.get(`/auth/users/${id}`),
  create: (data) => apiClient.post('/auth/users', data),
  update: (id, data) => apiClient.put(`/auth/users/${id}`, data),
  delete: (id) => apiClient.delete(`/auth/users/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => apiClient.get('/notifications', { params }),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/mark-all-read'),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
};

export { apiClient };
export default apiClient; 
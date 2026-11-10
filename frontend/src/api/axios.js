import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000, // Generous timeout for Gemini AI generation
});

// Attach Authorization Bearer token to all requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cycleaware_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const userApi = {
  getMe: () => api.get('/users/me'),
  updateCycleProfile: (data) => api.post('/users/me/cycle-profile', data),
};

export const destinationsApi = {
  getAll: (params) => api.get('/destinations', { params }),
  getByIds: (ids) => api.get('/destinations/by-ids', { params: { ids: ids.join(',') } }),
};

export const budgetApi = {
  calculate: (data) => api.post('/budget/calculate', data),
};

export const itineraryApi = {
  generate: (data) => api.post('/itinerary/generate', data),
};

export const feedbackApi = {
  submit: (data) => api.post('/feedback', data),
  getAll: () => api.get('/feedback'),
};

export default api;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Farmer Authentication APIs
export const farmerAPI = {
  register: async (farmerData) => {
    try {
      const response = await api.post('/farmer/register', farmerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (mobile) => {
    try {
      const response = await api.post('/farmer/login', { mobile });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifyOTP: async (mobile, otp) => {
    try {
      const response = await api.post('/farmer/verify-otp', { mobile, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/farmer/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/farmer/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSummary: async () => {
    try {
      const response = await api.get('/farmer/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Expense APIs
export const expenseAPI = {
  create: async (expenseData) => {
    try {
      const response = await api.post('/expense', expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAll: async (params = {}) => {
    try {
      const response = await api.get('/expense', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/expense/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, expenseData) => {
    try {
      const response = await api.put(`/expense/${id}`, expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/expense/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Crop APIs
export const cropAPI = {
  create: async (cropData) => {
    try {
      const response = await api.post('/crop', cropData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAll: async (params = {}) => {
    try {
      const response = await api.get('/crop', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRecommendations: async (soilType, season, landSize) => {
    try {
      const response = await api.post('/crop/recommend', {
        soilType,
        season,
        landSize
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, cropData) => {
    try {
      const response = await api.put(`/crop/${id}`, cropData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/crop/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Weather APIs
export const weatherAPI = {
  get: async (location = 'Delhi') => {
    try {
      const response = await api.get(`/weather?location=${location}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getInsights: async (location) => {
    try {
      const response = await api.get(`/weather/insights/${location}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Insights APIs
export const insightsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/insights');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCategory: async (category) => {
    try {
      const response = await api.get(`/insights/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default api;

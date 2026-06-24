import axios from 'axios'

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('farmer')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

// API functions
export const farmerAPI = {
  // Authentication
  register: (farmerData) => api.post('/farmer/register', farmerData),
  login: (mobile) => api.post('/farmer/login', { mobile }),
  verifyOTP: (mobile, otp) => api.post('/farmer/verify-otp', { mobile, otp }),
  getProfile: () => api.get('/farmer/profile'),
  
  // Expenses
  addExpense: (expenseData) => api.post('/expense', expenseData),
  getExpenses: (params) => api.get('/expense', { params }),
  getExpenseSummary: (params) => api.get('/expense/summary', { params }),
  deleteExpense: (id) => api.delete(`/expense/${id}`),
  
  // Crops
  getCropRecommendations: (data) => api.post('/crop/recommend', data),
  addCrop: (cropData) => api.post('/crop', cropData),
  getCrops: (params) => api.get('/crop', { params }),
  updateCrop: (id, data) => api.put(`/crop/${id}`, data),
  
  // Weather
  getWeather: (location) => api.get('/weather', { params: { location } }),
  getWeatherForecast: (location) => api.get('/weather/forecast', { params: { location } }),
}

export default api

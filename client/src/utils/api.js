import axios from 'axios'

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development, always use relative path to route through Vite's proxy.
  // This avoids CORS issues and allows testing on local network (e.g. mobile devices).
  if (import.meta.env.DEV) {
    return '/';
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/';
  }
  return 'http://localhost:5001';
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qrkfind_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/api/auth/')
      if (!isAuthRoute) {
        localStorage.removeItem('qrkfind_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

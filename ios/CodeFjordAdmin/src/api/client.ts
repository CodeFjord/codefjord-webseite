import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api-staging.code-fjord.de/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor für JWT Token
apiClient.interceptors.request.use(
  async (config) => {
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📝 Request Data:', config.data);
    
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token vorhanden');
    } else {
      console.log('❌ Kein Token gefunden');
    }
    return config;
  },
  (error) => {
    console.log('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor für Error Handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    console.log('📊 Response Data:', response.data);
    return response;
  },
  async (error) => {
    console.log('❌ API Error:', error.response?.status, error.config?.url);
    console.log('🚨 Error Details:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - Token entfernen');
      await AsyncStorage.removeItem('authToken');
      // Hier könntest du zur Login-Seite navigieren
    }
    return Promise.reject(error);
  }
);

export default apiClient; 
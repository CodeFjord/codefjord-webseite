import apiClient from './client.js';

export const appApi = {
  // App-Download-Informationen abrufen
  getDownloadInfo: async () => {
    const response = await apiClient.get('/app/download-info');
    return response.data;
  },

  // App-Download-Statistiken abrufen
  getDownloadStats: async () => {
    const response = await apiClient.get('/app/download-stats');
    return response.data;
  }
}; 
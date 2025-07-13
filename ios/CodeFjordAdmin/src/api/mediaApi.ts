import apiClient from './client';

export interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export const mediaApi = {
  // Alle Medien-Dateien abrufen
  getAll: async (): Promise<MediaItem[]> => {
    const response = await apiClient.get('/media');
    return response.data;
  },

  // Einzelne Medien-Datei abrufen
  getById: async (id: number): Promise<MediaItem> => {
    const response = await apiClient.get(`/media/${id}`);
    return response.data;
  },

  // Medien-Datei hochladen
  upload: async (file: any): Promise<MediaItem> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Medien-Datei löschen
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },
}; 
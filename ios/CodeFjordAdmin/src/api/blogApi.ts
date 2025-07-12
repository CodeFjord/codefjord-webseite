import apiClient from './client';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const blogApi = {
  // Alle Blog-Posts abrufen
  getAll: async (): Promise<BlogPost[]> => {
    const response = await apiClient.get('/blog');
    return response.data;
  },

  // Einzelnen Blog-Post abrufen
  getById: async (id: number): Promise<BlogPost> => {
    const response = await apiClient.get(`/blog/${id}`);
    return response.data;
  },

  // Neuen Blog-Post erstellen
  create: async (data: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await apiClient.post('/blog', data);
    return response.data;
  },

  // Blog-Post aktualisieren
  update: async (id: number, data: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await apiClient.put(`/blog/${id}`, data);
    return response.data;
  },

  // Blog-Post löschen
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/blog/${id}`);
  },
}; 
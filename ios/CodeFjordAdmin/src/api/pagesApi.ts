import apiClient from './client';

export interface Page {
  id: number;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const pagesApi = {
  // Alle Seiten abrufen
  getAll: async (): Promise<Page[]> => {
    const response = await apiClient.get('/pages');
    return response.data;
  },

  // Einzelne Seite abrufen
  getById: async (id: number): Promise<Page> => {
    const response = await apiClient.get(`/pages/${id}`);
    return response.data;
  },

  // Neue Seite erstellen
  create: async (data: Partial<Page>): Promise<Page> => {
    const response = await apiClient.post('/pages', data);
    return response.data;
  },

  // Seite aktualisieren
  update: async (id: number, data: Partial<Page>): Promise<Page> => {
    const response = await apiClient.put(`/pages/${id}`, data);
    return response.data;
  },

  // Seite löschen
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/pages/${id}`);
  },
}; 
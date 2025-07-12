import apiClient from './client';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string;
  link: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const portfolioApi = {
  // Alle Portfolio-Einträge abrufen
  getAll: async (): Promise<PortfolioItem[]> => {
    const response = await apiClient.get('/portfolio');
    return response.data;
  },

  // Einzelnen Portfolio-Eintrag abrufen
  getById: async (id: number): Promise<PortfolioItem> => {
    const response = await apiClient.get(`/portfolio/${id}`);
    return response.data;
  },

  // Neuen Portfolio-Eintrag erstellen
  create: async (data: Partial<PortfolioItem>): Promise<PortfolioItem> => {
    const response = await apiClient.post('/portfolio', data);
    return response.data;
  },

  // Portfolio-Eintrag aktualisieren
  update: async (id: number, data: Partial<PortfolioItem>): Promise<PortfolioItem> => {
    const response = await apiClient.put(`/portfolio/${id}`, data);
    return response.data;
  },

  // Portfolio-Eintrag löschen
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/portfolio/${id}`);
  },
}; 
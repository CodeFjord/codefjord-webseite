import apiClient from './client';

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string;
  email: string;
  linkedin: string;
  github: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const teamApi = {
  // Alle Team-Mitglieder abrufen
  getAll: async (): Promise<TeamMember[]> => {
    const response = await apiClient.get('/team-members');
    return response.data;
  },

  // Einzelnes Team-Mitglied abrufen
  getById: async (id: number): Promise<TeamMember> => {
    const response = await apiClient.get(`/team-members/${id}`);
    return response.data;
  },

  // Neues Team-Mitglied erstellen
  create: async (data: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await apiClient.post('/team-members', data);
    return response.data;
  },

  // Team-Mitglied aktualisieren
  update: async (id: number, data: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await apiClient.put(`/team-members/${id}`, data);
    return response.data;
  },

  // Team-Mitglied löschen
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/team-members/${id}`);
  },
}; 
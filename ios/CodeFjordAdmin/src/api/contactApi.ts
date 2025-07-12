import apiClient from './client';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'neu' | 'gelesen' | 'beantwortet';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export const contactApi = {
  // Alle Kontaktnachrichten abrufen
  getAll: async (): Promise<ContactMessage[]> => {
    const response = await apiClient.get('/contact');
    return response.data;
  },

  // Einzelne Nachricht abrufen
  getById: async (id: number): Promise<ContactMessage> => {
    const response = await apiClient.get(`/contact/${id}`);
    return response.data;
  },

  // Nachricht als gelesen markieren
  markAsRead: async (id: number): Promise<ContactMessage> => {
    const response = await apiClient.patch(`/contact/${id}`, { status: 'gelesen' });
    return response.data;
  },

  // Auf Nachricht antworten
  reply: async (id: number, replyText: string): Promise<{ success: boolean; item: ContactMessage }> => {
    const response = await apiClient.post(`/contact/reply/${id}`, { replyText });
    return response.data;
  },

  // Nachricht löschen
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/contact/${id}`);
  },
}; 
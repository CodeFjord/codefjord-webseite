import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Title, Paragraph, Button, ActivityIndicator, useTheme, Snackbar, Modal, Portal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { contactApi, ContactMessage } from '../api/contactApi';
import ModernCard from '../components/ui/ModernCard';

const ContactScreen = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [actionLoading, setActionLoading] = useState<{ [id: number]: boolean }>({});
  const [replyModal, setReplyModal] = useState<{ visible: boolean; message: ContactMessage | null; replyText: string }>({
    visible: false,
    message: null,
    replyText: ''
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.getAll();
      setMessages(data);
      console.log('📊 Kontakt-Daten geladen:', data.length, 'Nachrichten');
    } catch (error) {
      console.log('❌ Fehler beim Laden der Kontakt-Daten:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (id: number) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await contactApi.markAsRead(id);
      setSnackbar({ visible: true, message: 'Nachricht als gelesen markiert.' });
      await loadMessages();
    } catch (error) {
      setSnackbar({ visible: true, message: 'Fehler beim Markieren als gelesen.' });
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReply = (message: ContactMessage) => {
    setReplyModal({ visible: true, message, replyText: '' });
  };

  const handleSendReply = async () => {
    if (!replyModal.message || !replyModal.replyText.trim()) return;
    
    const messageId = replyModal.message.id;
    setActionLoading((prev) => ({ ...prev, [messageId]: true }));
    try {
      await contactApi.reply(messageId, replyModal.replyText.trim());
      setSnackbar({ visible: true, message: 'Antwort gesendet.' });
      setReplyModal({ visible: false, message: null, replyText: '' });
      await loadMessages();
    } catch (error) {
      setSnackbar({ visible: true, message: 'Fehler beim Senden der Antwort.' });
    } finally {
      setActionLoading((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await contactApi.delete(id);
      setSnackbar({ visible: true, message: 'Nachricht gelöscht.' });
      await loadMessages();
    } catch (error) {
      setSnackbar({ visible: true, message: 'Fehler beim Löschen.' });
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            Lade Kontakt-Daten...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Title style={{ color: theme.colors.onSurface }}>Kontakt Verwaltung</Title>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>{messages.length} Nachrichten</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              Keine Nachrichten
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
              Hier werden eingehende Nachrichten angezeigt
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <ModernCard key={message.id} style={styles.card} variant="elevated">
              <View style={styles.cardContent}>
                <View style={styles.messageHeader}>
                  <Title style={{ color: theme.colors.onSurface }}>{message.subject}</Title>
                  <Text style={[styles.status, { 
                    color: message.status === 'neu' ? theme.colors.primary : theme.colors.onSurfaceVariant 
                  }]}>
                    {message.status === 'neu' ? 'Neu' : message.status === 'gelesen' ? 'Gelesen' : 'Beantwortet'}
                  </Text>
                </View>
                <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>{message.message}</Paragraph>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                  Von: {message.name} ({message.email})
                </Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                  Betreff: {message.subject}
                </Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                  Erhalten: {new Date(message.createdAt).toLocaleDateString('de-DE')}
                </Text>
                {message.adminReply && (
                  <View style={styles.replyContainer}>
                    <Text style={[styles.replyLabel, { color: theme.colors.primary }]}>Antwort:</Text>
                    <Text style={[styles.replyText, { color: theme.colors.onSurfaceVariant }]}>
                      {message.adminReply}
                    </Text>
                  </View>
                )}
                <View style={styles.cardActions}>
                  <Button 
                    mode="outlined" 
                    compact 
                    disabled={actionLoading[message.id] || message.status === 'beantwortet'}
                    onPress={() => handleReply(message)}
                  >
                    Antworten
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    disabled={message.status !== 'neu' || actionLoading[message.id]}
                    loading={actionLoading[message.id]}
                    onPress={() => handleMarkAsRead(message.id)}
                  >
                    Als gelesen markieren
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    disabled={actionLoading[message.id]}
                    loading={actionLoading[message.id]}
                    onPress={() => handleDelete(message.id)}
                  >
                    Löschen
                  </Button>
                </View>
              </View>
            </ModernCard>
          ))
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={replyModal.visible}
          onDismiss={() => setReplyModal({ visible: false, message: null, replyText: '' })}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Antwort an {replyModal.message?.name}
          </Title>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
            Betreff: {replyModal.message?.subject}
          </Text>
          <TextInput
            mode="outlined"
            label="Ihre Antwort"
            value={replyModal.replyText}
            onChangeText={(text) => setReplyModal(prev => ({ ...prev, replyText: text }))}
            multiline
            numberOfLines={6}
            style={{ marginBottom: 16 }}
          />
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setReplyModal({ visible: false, message: null, replyText: '' })}
              style={{ marginRight: 8 }}
            >
              Abbrechen
            </Button>
            <Button
              mode="contained"
              onPress={handleSendReply}
              loading={actionLoading[replyModal.message?.id || 0]}
              disabled={!replyModal.replyText.trim()}
            >
              Senden
            </Button>
          </View>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={2500}
        style={{ backgroundColor: theme.colors.primary }}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    opacity: 0.7,
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 12,
    marginTop: 4,
  },
  replyContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  replyText: {
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default ContactScreen; 
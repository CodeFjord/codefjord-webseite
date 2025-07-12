import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Snackbar, useTheme, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { contactApi } from '../api/contactApi';

const ContactEditScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const message = route.params?.message;
  const onSave = route.params?.onSave;
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  if (!message) {
    return null;
  }

  const handleMarkAsRead = async () => {
    setLoading(true);
    try {
      await contactApi.markAsRead(message.id);
      setSnackbar({ visible: true, message: 'Nachricht als gelesen markiert.', error: false });
      setTimeout(() => {
        navigation.goBack();
        onSave && onSave();
      }, 800);
    } catch (e) {
      setSnackbar({ visible: true, message: 'Fehler beim Aktualisieren.', error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Löschen bestätigen',
      'Möchtest du diese Nachricht wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: doDelete },
      ]
    );
    async function doDelete() {
      setLoading(true);
      try {
        await contactApi.delete(message.id);
        setSnackbar({ visible: true, message: 'Nachricht gelöscht.', error: false });
        setTimeout(() => {
          navigation.goBack();
          onSave && onSave();
        }, 800);
      } catch (e) {
        setSnackbar({ visible: true, message: 'Fehler beim Löschen.', error: true });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>Nachricht</Title>
        <Text style={styles.label}>Von:</Text>
        <Text style={styles.value}>{message.name} ({message.email})</Text>
        <Text style={styles.label}>Betreff:</Text>
        <Text style={styles.value}>{message.subject}</Text>
        <Text style={styles.label}>Nachricht:</Text>
        <Text style={styles.value}>{message.message}</Text>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{message.read ? 'Gelesen' : 'Ungelesen'}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24, gap: 8 }}>
          {!message.read && (
            <Button mode="contained" onPress={handleMarkAsRead} loading={loading}>
              Als gelesen markieren
            </Button>
          )}
          <Button mode="outlined" onPress={handleDelete} loading={loading} color={theme.colors.error}>
            Löschen
          </Button>
        </View>
        <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          Zurück
        </Button>
      </ScrollView>
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2500}
        style={{ backgroundColor: snackbar.error ? theme.colors.error : theme.colors.primary }}
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
  content: {
    padding: 20,
  },
  label: {
    color: '#888',
    fontWeight: '600',
    marginTop: 12,
  },
  value: {
    color: '#222',
    marginBottom: 4,
  },
});

export default ContactEditScreen; 
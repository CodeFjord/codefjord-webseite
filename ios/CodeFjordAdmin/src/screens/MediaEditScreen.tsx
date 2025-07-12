import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Switch, Snackbar, useTheme, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mediaApi } from '../api/mediaApi';

const MediaEditScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const editingItem = route.params?.item || null;
  const isEdit = !!editingItem;

  const [form, setForm] = useState({
    originalName: '',
    mimeType: '',
    size: '',
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    if (editingItem) {
      setForm({
        originalName: editingItem.originalName || '',
        mimeType: editingItem.mimeType || '',
        size: editingItem.size ? String(editingItem.size) : '',
        published: !!editingItem.published,
      });
    }
  }, [editingItem]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.originalName) {
      setSnackbar({ visible: true, message: 'Dateiname ist ein Pflichtfeld.', error: true });
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await mediaApi.update(editingItem.id, form);
        setSnackbar({ visible: true, message: 'Datei aktualisiert.', error: false });
      } else {
        await mediaApi.create(form);
        setSnackbar({ visible: true, message: 'Datei erstellt.', error: false });
      }
      setTimeout(() => {
        navigation.goBack();
        route.params?.onSave && route.params.onSave();
      }, 800);
    } catch (e) {
      setSnackbar({ visible: true, message: 'Fehler beim Speichern.', error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          {isEdit ? 'Datei bearbeiten' : 'Neue Datei anlegen'}
        </Title>
        <TextInput
          label="Dateiname"
          value={form.originalName}
          onChangeText={v => handleChange('originalName', v)}
          style={styles.input}
        />
        <TextInput
          label="MIME-Type"
          value={form.mimeType}
          onChangeText={v => handleChange('mimeType', v)}
          style={styles.input}
        />
        <TextInput
          label="Größe (in Bytes)"
          value={form.size}
          onChangeText={v => handleChange('size', v)}
          style={styles.input}
          keyboardType="numeric"
        />
        <View style={styles.switchRow}>
          <Text style={{ color: theme.colors.onSurface }}>Veröffentlicht</Text>
          <Switch value={form.published} onValueChange={v => handleChange('published', v)} />
        </View>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          style={{ marginTop: 24 }}
        >
          {isEdit ? 'Speichern' : 'Anlegen'}
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 8 }}
        >
          Abbrechen
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
  input: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
});

export default MediaEditScreen; 
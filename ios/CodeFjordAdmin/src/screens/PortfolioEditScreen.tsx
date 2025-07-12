import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Switch, Snackbar, useTheme, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { portfolioApi } from '../api/portfolioApi';

const PortfolioEditScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const editingItem = route.params?.item || null;
  const isEdit = !!editingItem;

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    technologies: '',
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        description: editingItem.description || '',
        category: editingItem.category || '',
        technologies: editingItem.technologies || '',
        published: !!editingItem.published,
      });
    }
  }, [editingItem]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title) {
      setSnackbar({ visible: true, message: 'Titel ist ein Pflichtfeld.', error: true });
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await portfolioApi.update(editingItem.id, form);
        setSnackbar({ visible: true, message: 'Portfolio-Eintrag aktualisiert.', error: false });
      } else {
        await portfolioApi.create(form);
        setSnackbar({ visible: true, message: 'Portfolio-Eintrag erstellt.', error: false });
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
          {isEdit ? 'Portfolio-Eintrag bearbeiten' : 'Neuen Portfolio-Eintrag anlegen'}
        </Title>
        <TextInput
          label="Titel"
          value={form.title}
          onChangeText={v => handleChange('title', v)}
          style={styles.input}
        />
        <TextInput
          label="Beschreibung"
          value={form.description}
          onChangeText={v => handleChange('description', v)}
          style={styles.input}
          multiline
          numberOfLines={4}
        />
        <TextInput
          label="Kategorie"
          value={form.category}
          onChangeText={v => handleChange('category', v)}
          style={styles.input}
        />
        <TextInput
          label="Technologien (Komma-getrennt)"
          value={form.technologies}
          onChangeText={v => handleChange('technologies', v)}
          style={styles.input}
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

export default PortfolioEditScreen; 
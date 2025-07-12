import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Switch, Snackbar, useTheme, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pagesApi } from '../api/pagesApi';

const PagesEditScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const editingPage = route.params?.page || null;
  const isEdit = !!editingPage;

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    if (editingPage) {
      setForm({
        title: editingPage.title || '',
        slug: editingPage.slug || '',
        content: editingPage.content || '',
        published: !!editingPage.published,
      });
    }
  }, [editingPage]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'title' && !isEdit) {
      setForm((prev) => ({ ...prev, slug: generateSlug(value as string) }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[äöüß]/g, (match: string) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match] || match))
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      setSnackbar({ visible: true, message: 'Titel und Slug sind Pflichtfelder.', error: true });
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await pagesApi.update(editingPage.id, form);
        setSnackbar({ visible: true, message: 'Seite aktualisiert.', error: false });
      } else {
        await pagesApi.create(form);
        setSnackbar({ visible: true, message: 'Seite erstellt.', error: false });
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
          {isEdit ? 'Seite bearbeiten' : 'Neue Seite anlegen'}
        </Title>
        <TextInput
          label="Titel"
          value={form.title}
          onChangeText={v => handleChange('title', v)}
          style={styles.input}
        />
        <TextInput
          label="Slug"
          value={form.slug}
          onChangeText={v => handleChange('slug', v)}
          style={styles.input}
        />
        <TextInput
          label="Inhalt"
          value={form.content}
          onChangeText={v => handleChange('content', v)}
          style={styles.input}
          multiline
          numberOfLines={8}
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

export default PagesEditScreen; 
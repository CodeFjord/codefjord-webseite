import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Switch, Snackbar, useTheme, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { blogApi } from '../api/blogApi';

const BlogEditScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const editingBlog = route.params?.blog || null;
  const isEdit = !!editingBlog;

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    if (editingBlog) {
      setForm({
        title: editingBlog.title || '',
        slug: editingBlog.slug || '',
        excerpt: editingBlog.excerpt || '',
        content: editingBlog.content || '',
        published: !!editingBlog.published,
        tags: editingBlog.tags || ''
      });
    }
  }, [editingBlog]);

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
        await blogApi.update(editingBlog.id, form);
        setSnackbar({ visible: true, message: 'Blog-Artikel aktualisiert.', error: false });
      } else {
        await blogApi.create(form);
        setSnackbar({ visible: true, message: 'Blog-Artikel erstellt.', error: false });
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
          {isEdit ? 'Blog-Artikel bearbeiten' : 'Neuen Blog-Artikel anlegen'}
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
          label="Kurzbeschreibung"
          value={form.excerpt}
          onChangeText={v => handleChange('excerpt', v)}
          style={styles.input}
        />
        <TextInput
          label="Inhalt"
          value={form.content}
          onChangeText={v => handleChange('content', v)}
          style={styles.input}
          multiline
          numberOfLines={6}
        />
        <TextInput
          label="Tags (Komma-getrennt)"
          value={form.tags}
          onChangeText={v => handleChange('tags', v)}
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

export default BlogEditScreen; 
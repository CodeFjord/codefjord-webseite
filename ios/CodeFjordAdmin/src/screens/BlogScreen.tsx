import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Title, Paragraph, Button, FAB, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { blogApi, BlogPost } from '../api/blogApi';
import ModernCard from '../components/ui/ModernCard';
import { useNavigation } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';

const BlogScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setIsLoading(true);
      const data = await blogApi.getAll();
      setBlogPosts(data);
      // console.log('📊 Blog-Daten geladen:', data.length, 'Artikel');
    } catch (error) {
      setSnackbar({ visible: true, message: 'Fehler beim Laden der Blog-Daten.', error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBlogPosts();
    setRefreshing(false);
  };

  const handleEdit = (blog: BlogPost) => {
    (navigation as any).navigate('BlogEdit', {
      blog,
      onSave: loadBlogPosts,
    });
  };

  const handleCreate = () => {
    (navigation as any).navigate('BlogEdit', {
      onSave: loadBlogPosts,
    });
  };

  const handleDelete = (blog: BlogPost) => {
    Alert.alert(
      'Löschen bestätigen',
      'Möchtest du diesen Blog-Artikel wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: doDelete },
      ]
    );
    function doDelete() {
      blogApi.delete(blog.id)
        .then(() => {
          setSnackbar({ visible: true, message: 'Blog-Artikel gelöscht.', error: false });
          loadBlogPosts();
        })
        .catch(() => {
          setSnackbar({ visible: true, message: 'Fehler beim Löschen.', error: true });
        });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>Lade Blog-Daten...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}> 
        <Title style={{ color: theme.colors.onSurface }}>Blog Verwaltung</Title>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>{blogPosts.length} Artikel</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {blogPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="headlineSmall">Keine Blog-Artikel</Text>
            <Text variant="bodyMedium">Erstelle deinen ersten Blog-Artikel</Text>
          </View>
        ) : (
          blogPosts.map((post) => (
            <ModernCard key={post.id} style={styles.card} variant="elevated">
              <View style={styles.cardContent}>
                <Title style={{ color: theme.colors.onSurface }}>{post.title}</Title>
                <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>{post.excerpt}</Paragraph>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Autor: {post.author}</Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Status: {post.published ? 'Veröffentlicht' : 'Entwurf'}</Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Erstellt: {new Date(post.createdAt).toLocaleDateString('de-DE')}</Text>
                <View style={styles.cardActions}>
                  <Button mode="outlined" compact onPress={() => handleEdit(post)}>Bearbeiten</Button>
                  <Button mode="outlined" compact onPress={() => handleDelete(post)} color={theme.colors.error}>Löschen</Button>
                </View>
              </View>
            </ModernCard>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreate}
      />
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
  card: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  metaText: {
    fontSize: 12,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default BlogScreen; 
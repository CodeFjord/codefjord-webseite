import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Title, Paragraph, Button, FAB, ActivityIndicator, useTheme, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pagesApi, Page } from '../api/pagesApi';
import ModernCard from '../components/ui/ModernCard';
import { useNavigation } from '@react-navigation/native';

const PagesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const data = await pagesApi.getAll();
      setPages(data);
    } catch (error) {
      setSnackbar({ visible: true, message: 'Fehler beim Laden der Seiten.', error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPages();
    setRefreshing(false);
  };

  const handleEdit = (page: Page) => {
    (navigation as any).navigate('PagesEdit', {
      page,
      onSave: loadPages,
    });
  };

  const handleCreate = () => {
    (navigation as any).navigate('PagesEdit', {
      onSave: loadPages,
    });
  };

  const handleDelete = (page: Page) => {
    Alert.alert(
      'Löschen bestätigen',
      'Möchtest du diese Seite wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: doDelete },
      ]
    );
    function doDelete() {
      pagesApi.delete(page.id)
        .then(() => {
          setSnackbar({ visible: true, message: 'Seite gelöscht.', error: false });
          loadPages();
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
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>Lade Seiten...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}> 
        <Title style={{ color: theme.colors.onSurface }}>Seiten Verwaltung</Title>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>{pages.length} Seiten</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {pages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.colors.onSurface, fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Keine Seiten</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16, opacity: 0.7 }}>Erstelle deine erste Seite</Text>
          </View>
        ) : (
          pages.map((page) => (
            <ModernCard key={page.id} style={styles.card} variant="elevated">
              <View style={styles.cardContent}>
                <Title style={{ color: theme.colors.onSurface }}>{page.title}</Title>
                <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>{page.content.substring(0, 100)}...</Paragraph>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Slug: {page.slug}</Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Status: {page.published ? 'Veröffentlicht' : 'Entwurf'}</Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Erstellt: {new Date(page.createdAt).toLocaleDateString('de-DE')}</Text>
                <View style={styles.cardActions}>
                  <Button mode="outlined" compact onPress={() => handleEdit(page)}>Bearbeiten</Button>
                  <Button mode="outlined" compact onPress={() => handleDelete(page)} color={theme.colors.error}>Löschen</Button>
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

export default PagesScreen; 
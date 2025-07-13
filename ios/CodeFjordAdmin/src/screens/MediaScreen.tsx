import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Title, Paragraph, Button, FAB, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mediaApi, MediaItem as Media } from '../api/mediaApi';
import ModernCard from '../components/ui/ModernCard';

const MediaScreen = () => {
  const theme = useTheme();
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const data = await mediaApi.getAll();
      setMedia(data);
      console.log('📊 Media-Daten geladen:', data.length, 'Dateien');
    } catch (error) {
      console.log('❌ Fehler beim Laden der Media-Daten:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMedia();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            Lade Media-Daten...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Title style={{ color: theme.colors.onSurface }}>Media Verwaltung</Title>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>{media.length} Dateien</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {media.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              Keine Dateien
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
              Lade deine erste Datei hoch
            </Text>
          </View>
        ) : (
          media.map((item) => (
            <ModernCard key={item.id} style={styles.card} variant="elevated">
              <View style={styles.cardContent}>
                <Title style={{ color: theme.colors.onSurface }}>{item.filename}</Title>
                <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>{item.originalName}</Paragraph>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                  Typ: {item.mimeType}
                </Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                  Größe: {Math.round(item.size / 1024)} KB
                </Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
                  Hochgeladen: {new Date(item.createdAt).toLocaleDateString('de-DE')}
                </Text>
                <View style={styles.cardActions}>
                  <Button mode="outlined" compact>Herunterladen</Button>
                  <Button mode="outlined" compact>Löschen</Button>
                </View>
              </View>
            </ModernCard>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Datei hochladen')}
      />
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

export default MediaScreen; 
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Title, Paragraph, Button, FAB, ActivityIndicator, useTheme, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { portfolioApi, PortfolioItem } from '../api/portfolioApi';
import ModernCard from '../components/ui/ModernCard';
import { useNavigation } from '@react-navigation/native';

const PortfolioScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    loadPortfolioItems();
  }, []);

  const loadPortfolioItems = async () => {
    try {
      setIsLoading(true);
      const data = await portfolioApi.getAll();
      setPortfolioItems(data);
    } catch (error) {
      setSnackbar({ visible: true, message: 'Fehler beim Laden der Portfolio-Daten.', error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPortfolioItems();
    setRefreshing(false);
  };

  const handleEdit = (item: PortfolioItem) => {
    (navigation as any).navigate('PortfolioEdit', {
      item,
      onSave: loadPortfolioItems,
    });
  };

  const handleCreate = () => {
    (navigation as any).navigate('PortfolioEdit', {
      onSave: loadPortfolioItems,
    });
  };

  const handleDelete = (item: PortfolioItem) => {
    Alert.alert(
      'Löschen bestätigen',
      'Möchtest du diesen Portfolio-Eintrag wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: doDelete },
      ]
    );
    function doDelete() {
      portfolioApi.delete(item.id)
        .then(() => {
          setSnackbar({ visible: true, message: 'Portfolio-Eintrag gelöscht.', error: false });
          loadPortfolioItems();
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
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>Lade Portfolio-Daten...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}> 
        <Title style={{ color: theme.colors.onSurface }}>Portfolio Verwaltung</Title>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>{portfolioItems.length} Einträge</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {portfolioItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.colors.onSurface, fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Keine Portfolio-Einträge</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16, opacity: 0.7 }}>Erstelle deinen ersten Portfolio-Eintrag</Text>
          </View>
        ) : (
          portfolioItems.map((item) => (
            <ModernCard key={item.id} style={styles.card} variant="elevated">
              <View style={styles.cardContent}>
                <Title style={{ color: theme.colors.onSurface }}>{item.title}</Title>
                <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>{item.description}</Paragraph>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Kategorie: {item.category}</Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Technologien: {item.technologies}</Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Status: {item.published ? 'Veröffentlicht' : 'Entwurf'}</Text>
                <View style={styles.cardActions}>
                  <Button mode="outlined" compact onPress={() => handleEdit(item)}>Bearbeiten</Button>
                  <Button mode="outlined" compact onPress={() => handleDelete(item)} color={theme.colors.error}>Löschen</Button>
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

export default PortfolioScreen; 
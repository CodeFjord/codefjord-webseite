import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Title,
  Paragraph,
  useTheme,
  IconButton,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { portfolioApi } from '../api/portfolioApi';
import { blogApi } from '../api/blogApi';
import StatCard from '../components/ui/StatCard';
import ModernCard from '../components/ui/ModernCard';

const DashboardScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const [portfolioCount, setPortfolioCount] = useState<number>(0);
  const [blogCount, setBlogCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Daten beim Laden abrufen
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Portfolio-Daten laden
      const portfolioData = await portfolioApi.getAll();
      setPortfolioCount(portfolioData.length);

      // Blog-Daten laden
      const blogData = await blogApi.getAll();
      setBlogCount(blogData.length);

      console.log('📊 Dashboard-Daten geladen:', {
        portfolio: portfolioData.length,
        blog: blogData.length
      });
    } catch (error) {
      console.log('❌ Fehler beim Laden der Dashboard-Daten:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Abmelden',
      'Möchtest du dich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Portfolio',
      description: 'Portfolio-Einträge verwalten',
      icon: 'briefcase',
      onPress: () => navigation.navigate('Portfolio'),
    },
    {
      title: 'Blog',
      description: 'Blog-Artikel verwalten',
      icon: 'post',
      onPress: () => navigation.navigate('Blog'),
    },
    {
      title: 'Seiten',
      description: 'Statische Seiten verwalten',
      icon: 'file-document',
      onPress: () => navigation.navigate('Pages'),
    },
    {
      title: 'Team',
      description: 'Team-Mitglieder verwalten',
      icon: 'account-group',
      onPress: () => navigation.navigate('Team'),
    },
    {
      title: 'Kontakt',
      description: 'Kontaktanfragen anzeigen',
      icon: 'email',
      onPress: () => navigation.navigate('Contact'),
    },
    {
      title: 'Medien',
      description: 'Medien-Dateien verwalten',
      icon: 'image',
      onPress: () => navigation.navigate('Media'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View>
          <Title style={{ color: theme.colors.onSurface }}>Dashboard</Title>
          <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
            Willkommen, {user?.name || user?.username}!
          </Paragraph>
        </View>
        <View style={styles.headerButtons}>
          <IconButton
            icon="logout"
            size={24}
            onPress={handleLogout}
            iconColor={theme.colors.onSurface}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
              Lade Dashboard-Daten...
            </Text>
          </View>
        ) : (
          <>
            {/* Statistik-Karten */}
            <View style={styles.statsContainer}>
              <StatCard
                title="Portfolio-Einträge"
                value={portfolioCount}
                icon="briefcase"
                color={theme.colors.primary}
                onPress={() => navigation.navigate('Portfolio')}
              />
              <StatCard
                title="Blog-Artikel"
                value={blogCount}
                icon="post"
                color={theme.colors.secondary}
                onPress={() => navigation.navigate('Blog')}
              />
            </View>

            {/* Menü-Karten */}
            <FlatList
              data={menuItems}
              keyExtractor={(_, idx) => idx.toString()}
              numColumns={2}
              contentContainerStyle={styles.menuList}
              columnWrapperStyle={styles.menuRow}
              renderItem={({ item }) => (
                <ModernCard
                  style={styles.menuCard}
                  onPress={item.onPress}
                  variant="elevated"
                >
                  <View style={styles.cardContent}>
                    <IconButton
                      icon={item.icon}
                      size={32}
                      iconColor={theme.colors.primary}
                    />
                    <Title numberOfLines={1} style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                      {item.title}
                    </Title>
                    <Paragraph numberOfLines={2} style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}>
                      {item.description}
                    </Paragraph>
                  </View>
                </ModernCard>
              )}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuList: {
    paddingBottom: 24,
  },
  menuRow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuCard: {
    flex: 1,
    margin: 8,
    minHeight: 140,
  },
  card: {
    flexBasis: '48%',
    maxWidth: '48%',
    flexGrow: 1,
    minHeight: 140,
    marginBottom: 16,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 140,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});

export default DashboardScreen; 
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Title, Paragraph, Button, FAB, ActivityIndicator, Avatar, useTheme, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { teamApi, TeamMember } from '../api/teamApi';
import ModernCard from '../components/ui/ModernCard';
import { useNavigation } from '@react-navigation/native';

const TeamScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await teamApi.getAll();
      setTeamMembers(data);
    } catch (error) {
      setSnackbar({ visible: true, message: 'Fehler beim Laden der Team-Daten.', error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeamMembers();
    setRefreshing(false);
  };

  const handleEdit = (member: TeamMember) => {
    (navigation as any).navigate('TeamEdit', {
      member,
      onSave: loadTeamMembers,
    });
  };

  const handleCreate = () => {
    (navigation as any).navigate('TeamEdit', {
      onSave: loadTeamMembers,
    });
  };

  const handleDelete = (member: TeamMember) => {
    Alert.alert(
      'Löschen bestätigen',
      'Möchtest du dieses Team-Mitglied wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: doDelete },
      ]
    );
    function doDelete() {
      teamApi.delete(member.id)
        .then(() => {
          setSnackbar({ visible: true, message: 'Team-Mitglied gelöscht.', error: false });
          loadTeamMembers();
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
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>Lade Team-Daten...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}> 
        <Title style={{ color: theme.colors.onSurface }}>Team Verwaltung</Title>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>{teamMembers.length} Mitglieder</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {teamMembers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.colors.onSurface, fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Keine Team-Mitglieder</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16, opacity: 0.7 }}>Füge dein erstes Team-Mitglied hinzu</Text>
          </View>
        ) : (
          teamMembers.map((member) => (
            <ModernCard key={member.id} style={styles.card} variant="elevated">
              <View style={styles.cardContent}>
                <View style={styles.memberHeader}>
                  <Avatar.Text 
                    size={50} 
                    label={member.name ? member.name.substring(0, 2) : '?'} 
                    style={{ backgroundColor: theme.colors.primary }}
                    labelStyle={{ color: theme.colors.onPrimary }}
                  />
                  <View style={styles.memberInfo}>
                    <Title style={{ color: theme.colors.onSurface }}>{member.name}</Title>
                    <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>{member.position}</Paragraph>
                  </View>
                </View>
                <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>{member.bio}</Paragraph>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>E-Mail: {member.email}</Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Status: {member.published ? 'Veröffentlicht' : 'Entwurf'}</Text>
                <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>Erstellt: {new Date(member.createdAt).toLocaleDateString('de-DE')}</Text>
                <View style={styles.cardActions}>
                  <Button mode="outlined" compact onPress={() => handleEdit(member)}>Bearbeiten</Button>
                  <Button mode="outlined" compact onPress={() => handleDelete(member)} color={theme.colors.error}>Löschen</Button>
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
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberInfo: {
    marginLeft: 16,
    flex: 1,
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

export default TeamScreen; 
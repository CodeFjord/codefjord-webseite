import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { Modal, Portal, Button } from 'react-native-paper';
import { 
  Text, 
  List, 
  Divider, 
  useTheme, 
  Card,
  Title,
  Paragraph,
  IconButton,
  RadioButton
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import ModernCard from '../components/ui/ModernCard';
import appJson from '../../app.json';
import pkg from '../../package.json';
import { Linking } from 'react-native';

const APP_NAME = appJson.displayName || appJson.name || 'CodeFjord Admin Panel';
const APP_VERSION = pkg.version || '1.0.0';
const BACKEND_URL = 'https://api.code-fjord.de/api/';

const SettingsScreen = ({ navigation: _navigation }: any) => {
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const { mode, setMode, getCurrentTheme } = useThemeStore();

  const [aboutVisible, setAboutVisible] = useState(false);

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

  const handleClearCache = () => {
    Alert.alert(
      'Cache leeren',
      'Möchtest du wirklich den Cache leeren?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Leeren',
          style: 'destructive',
          onPress: () => {
            // TODO: Cache leeren implementieren
            console.log('Cache geleert');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Title>Einstellungen</Title>
        <Paragraph>Verwalte deine App-Einstellungen</Paragraph>
      </View>

      <ScrollView style={styles.content}>
        {/* Benutzer-Info */}
        <ModernCard variant="elevated" style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                {(user?.name || user?.username || 'U').substring(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Title style={{ color: theme.colors.onSurface }}>
                {user?.name || user?.username}
              </Title>
              <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.email}
              </Paragraph>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                Rolle: {user?.role}
              </Text>
            </View>
          </View>
        </ModernCard>

        {/* Erscheinungsbild */}
        <ModernCard variant="elevated" style={styles.sectionCard}>
          <View style={styles.sectionContent}>
            <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Erscheinungsbild
            </Title>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <IconButton
                    icon="theme-light-dark"
                    size={20}
                    iconColor={theme.colors.primary}
                    style={styles.iconButton}
                  />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                    Theme-Modus
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                    Wählen Sie Ihr bevorzugtes Theme
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Theme-Optionen */}
            <View style={styles.themeOptions}>
              <Pressable 
                style={({ pressed }) => [
                  styles.themeOption,
                  pressed && { opacity: 0.7, backgroundColor: theme.colors.surfaceVariant }
                ]}
                onPress={() => setMode('light')}
              >
                <RadioButton
                  value="light"
                  status={mode === 'light' ? 'checked' : 'unchecked'}
                  onPress={() => setMode('light')}
                  color={theme.colors.primary}
                />
                <View style={styles.themeOptionContent}>
                  <View style={[styles.themeIcon, { backgroundColor: '#f8fafc' }]}>
                    <IconButton
                      icon="weather-sunny"
                      size={16}
                      iconColor="#f59e0b"
                      style={styles.iconButton}
                    />
                  </View>
                  <View style={styles.themeOptionText}>
                    <Text style={[styles.themeOptionTitle, { color: theme.colors.onSurface }]}>
                      Hell
                    </Text>
                    <Text style={[styles.themeOptionDescription, { color: theme.colors.onSurfaceVariant }]}>
                      Helles Theme
                    </Text>
                  </View>
                </View>
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.themeOption,
                  pressed && { opacity: 0.7, backgroundColor: theme.colors.surfaceVariant }
                ]}
                onPress={() => setMode('dark')}
              >
                <RadioButton
                  value="dark"
                  status={mode === 'dark' ? 'checked' : 'unchecked'}
                  onPress={() => setMode('dark')}
                  color={theme.colors.primary}
                />
                <View style={styles.themeOptionContent}>
                  <View style={[styles.themeIcon, { backgroundColor: '#1e293b' }]}>
                    <IconButton
                      icon="weather-night"
                      size={16}
                      iconColor="#a855f7"
                      style={styles.iconButton}
                    />
                  </View>
                  <View style={styles.themeOptionText}>
                    <Text style={[styles.themeOptionTitle, { color: theme.colors.onSurface }]}>
                      Dunkel
                    </Text>
                    <Text style={[styles.themeOptionDescription, { color: theme.colors.onSurfaceVariant }]}>
                      Dunkles Theme
                    </Text>
                  </View>
                </View>
              </Pressable>
              
              <Pressable 
                style={({ pressed }) => [
                  styles.themeOption,
                  pressed && { opacity: 0.7, backgroundColor: theme.colors.surfaceVariant }
                ]}
                onPress={() => setMode('system')}
              >
                <RadioButton
                  value="system"
                  status={mode === 'system' ? 'checked' : 'unchecked'}
                  onPress={() => setMode('system')}
                  color={theme.colors.primary}
                />
                <View style={styles.themeOptionContent}>
                  <View style={[styles.themeIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <IconButton
                      icon="theme-light-dark"
                      size={16}
                      iconColor={theme.colors.primary}
                      style={styles.iconButton}
                    />
                  </View>
                  <View style={styles.themeOptionText}>
                    <Text style={[styles.themeOptionTitle, { color: theme.colors.onSurface }]}>
                      System
                    </Text>
                    <Text style={[styles.themeOptionDescription, { color: theme.colors.onSurfaceVariant }]}>
                      Folgt System-Einstellung
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
            
            <Divider style={{ marginVertical: 12 }} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <IconButton
                    icon={getCurrentTheme() === 'dark' ? 'weather-night' : 'weather-sunny'}
                    size={20}
                    iconColor={theme.colors.secondary}
                    style={styles.iconButton}
                  />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                    Aktuelles Theme
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {getCurrentTheme() === 'dark' ? 'Dunkles Theme' : 'Helles Theme'}
                    {mode === 'system' && ' (System)'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ModernCard>

        {/* App-Einstellungen */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              App-Einstellungen
            </Title>
            
            <List.Item
              title="Cache leeren"
              description="Lokale Daten löschen"
              left={(props) => <List.Icon {...props} icon="delete-sweep" />}
              onPress={handleClearCache}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <List.Item
              title="Über die App"
              description="Version und Informationen"
              left={(props) => <List.Icon {...props} icon="information" />}
              onPress={() => setAboutVisible(true)}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <List.Item
              title="Datenschutz"
              description="Datenschutzerklärung"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              onPress={() => console.log('Datenschutz')}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            />
          </Card.Content>
        </Card>

        {/* Account */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Account
            </Title>
            
            <List.Item
              title="Profil bearbeiten"
              description="Persönliche Daten ändern"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              onPress={() => console.log('Profil bearbeiten')}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <List.Item
              title="Passwort ändern"
              description="Sicherheitseinstellungen"
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
              onPress={() => console.log('Passwort ändern')}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            />
          </Card.Content>
        </Card>

        {/* Abmelden */}
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
            textColor={theme.colors.error}
            icon="logout"
          >
            Abmelden
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            CodeFjord Admin v1.0.0
          </Text>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={aboutVisible}
          onDismiss={() => setAboutVisible(false)}
          contentContainerStyle={{
            margin: 24,
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
          }}
        >
          <Title style={{ color: theme.colors.onSurface, marginBottom: 12 }}>Über die App</Title>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>App-Name: <Text style={{ color: theme.colors.onSurface }}>{APP_NAME}</Text></Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>Version: <Text style={{ color: theme.colors.onSurface }}>{APP_VERSION}</Text></Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>Backend-URL: <Text style={{ color: theme.colors.onSurface }}>{BACKEND_URL}</Text></Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>Entwickler: <Text style={{ color: theme.colors.onSurface }}>Luca Stephan Kohls</Text></Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>Lizenz: <Text style={{ color: theme.colors.onSurface }}>MIT</Text></Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>Webseite: <Text style={{ color: theme.colors.primary }} onPress={() => Linking.openURL('https://code-fjord.de')}>code-fjord.de</Text></Text>
          <Button mode="contained" onPress={() => setAboutVisible(false)} style={{ marginTop: 8 }}>
            Schließen
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  logoutContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.7,
  },
  sectionContent: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    borderRadius: 8,
    marginRight: 16,
  },
  iconButton: {
    margin: 0,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  themeOptions: {
    marginTop: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  themeIcon: {
    borderRadius: 6,
    marginRight: 12,
  },
  themeOptionText: {
    flex: 1,
  },
  themeOptionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  themeOptionDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default SettingsScreen; 
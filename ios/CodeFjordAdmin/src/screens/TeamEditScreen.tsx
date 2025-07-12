import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Switch, Snackbar, useTheme, Title, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { teamApi } from '../api/teamApi';

const TeamEditScreen = ({ route, navigation }: any) => {
  const theme = useTheme();
  const editingMember = route.params?.member || null;
  const isEdit = !!editingMember;

  const [form, setForm] = useState({
    name: '',
    position: '',
    email: '',
    bio: '',
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', error: false });

  useEffect(() => {
    if (editingMember) {
      setForm({
        name: editingMember.name || '',
        position: editingMember.position || '',
        email: editingMember.email || '',
        bio: editingMember.bio || '',
        published: !!editingMember.published,
      });
    }
  }, [editingMember]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setSnackbar({ visible: true, message: 'Name und E-Mail sind Pflichtfelder.', error: true });
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await teamApi.update(editingMember.id, form);
        setSnackbar({ visible: true, message: 'Team-Mitglied aktualisiert.', error: false });
      } else {
        await teamApi.create(form);
        setSnackbar({ visible: true, message: 'Team-Mitglied erstellt.', error: false });
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
          {isEdit ? 'Team-Mitglied bearbeiten' : 'Neues Team-Mitglied anlegen'}
        </Title>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Avatar.Text
            size={64}
            label={form.name ? form.name.substring(0, 2) : '?'}
            style={{ backgroundColor: theme.colors.primary }}
            labelStyle={{ color: theme.colors.onPrimary, fontSize: 28 }}
          />
        </View>
        <TextInput
          label="Name"
          value={form.name}
          onChangeText={v => handleChange('name', v)}
          style={styles.input}
        />
        <TextInput
          label="Position"
          value={form.position}
          onChangeText={v => handleChange('position', v)}
          style={styles.input}
        />
        <TextInput
          label="E-Mail"
          value={form.email}
          onChangeText={v => handleChange('email', v)}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          label="Bio"
          value={form.bio}
          onChangeText={v => handleChange('bio', v)}
          style={styles.input}
          multiline
          numberOfLines={4}
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

export default TeamEditScreen; 
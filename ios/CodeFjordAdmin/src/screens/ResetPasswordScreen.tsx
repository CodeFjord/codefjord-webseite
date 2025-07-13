import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

const { height } = Dimensions.get('window');

interface ResetPasswordScreenProps {
  route?: {
    params?: {
      token?: string;
    };
  };
}

const ResetPasswordScreen = ({ route }: ResetPasswordScreenProps) => {
  const theme = useTheme();
  const [token] = useState(route?.params?.token || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const verifyResetToken = useAuthStore((state) => state.verifyResetToken);
  const resetPassword = useAuthStore((state) => state.resetPassword);

  // Validate password
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Passwort ist erforderlich');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Passwort muss mindestens 6 Zeichen lang sein');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validate confirm password
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Passwort-Bestätigung ist erforderlich');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwörter stimmen nicht überein');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Handle password change
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setError('');
    if (passwordError) {
      validatePassword(text);
    }
    if (confirmPassword && confirmPasswordError) {
      validateConfirmPassword(confirmPassword);
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setError('');
    if (confirmPasswordError) {
      validateConfirmPassword(text);
    }
  };

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;
      
      setIsValidating(true);
      setError('');
      
      try {
        const isValid = await verifyResetToken(token);
        setIsTokenValid(isValid);
        if (!isValid) {
          setError('Ungültiger oder abgelaufener Reset-Link. Bitte fordern Sie einen neuen Link an.');
        }
      } catch (error) {
        setError('Fehler bei der Token-Validierung. Bitte versuchen Sie es später erneut.');
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token, verifyResetToken]);

  const handleResetPassword = async () => {
    if (!token) {
      setError('Kein gültiger Reset-Token vorhanden.');
      return;
    }

    // Validate inputs
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const success = await resetPassword(token, password);
      if (success) {
        setSuccess(true);
      } else {
        setError('Fehler beim Zurücksetzen des Passworts. Bitte versuchen Sie es später erneut.');
      }
    } catch (error) {
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            Überprüfe Reset-Link...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isTokenValid) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: theme.colors.onSurface }]}>
            Ungültiger Reset-Link
          </Text>
          <Text style={[styles.errorText, { color: theme.colors.onSurfaceVariant }]}>
            {error || 'Der Reset-Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.'}
          </Text>
          <Button
            mode="contained"
            onPress={() => {/* Navigate back to login */}}
            style={{ marginTop: 20 }}
          >
            Zurück zum Login
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (success) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, { color: theme.colors.onSurface }]}>
            Passwort erfolgreich zurückgesetzt
          </Text>
          <Text style={[styles.successText, { color: theme.colors.onSurfaceVariant }]}>
            Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
          </Text>
          <Button
            mode="contained"
            onPress={() => {/* Navigate back to login */}}
            style={{ marginTop: 20 }}
          >
            Zum Login
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[styles.logoText, { color: theme.colors.onPrimaryContainer }]}>
                CF
              </Text>
            </View>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Passwort zurücksetzen
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Geben Sie Ihr neues Passwort ein
            </Text>
          </View>

          {/* Form */}
          <Surface style={[styles.formSurface, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <TextInput
              label="Neues Passwort"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              error={!!passwordError}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {passwordError ? (
              <HelperText type="error" visible={!!passwordError}>
                {passwordError}
              </HelperText>
            ) : null}

            <TextInput
              label="Passwort bestätigen"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              autoComplete="new-password"
              error={!!confirmPasswordError}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {confirmPasswordError ? (
              <HelperText type="error" visible={!!confirmPasswordError}>
                {confirmPasswordError}
              </HelperText>
            ) : null}

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
                <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                  {error}
                </Text>
              </View>
            ) : null}

            <Button
              mode="contained"
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={!password || !confirmPassword || !!passwordError || !!confirmPasswordError || isLoading}
              style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.resetButtonContent}
            >
              Passwort zurücksetzen
            </Button>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: height - 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  formSurface: {
    padding: 32,
    borderRadius: 16,
  },
  input: {
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  resetButtonContent: {
    paddingVertical: 8,
  },
});

export default ResetPasswordScreen; 
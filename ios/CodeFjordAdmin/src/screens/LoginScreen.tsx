import React, { useState } from 'react';
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
  Modal,
  Portal,
  Title,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const authLoading = useAuthStore((state) => state.isLoading);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('E-Mail ist erforderlich');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password validation
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

  // Handle email change
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setLoginError('');
    if (emailError) {
      validateEmail(text);
    }
  };

  // Handle password change
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setLoginError('');
    if (passwordError) {
      validatePassword(text);
    }
  };

  // Handle login
  const handleLogin = async () => {
    setLoginError('');
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setLoginError('Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.');
      }
    } catch (error) {
      setLoginError('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle enter key press
  const handleEmailSubmit = () => {
    if (validateEmail(email)) {
      // Focus password input
    }
  };

  const handlePasswordSubmit = () => {
    if (validatePassword(password)) {
      handleLogin();
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError('Bitte geben Sie Ihre E-Mail-Adresse ein.');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    
    try {
      const success = await forgotPassword(forgotPasswordEmail.trim());
      if (success) {
        setForgotPasswordSuccess(true);
        setTimeout(() => {
          setForgotPasswordModal(false);
          setForgotPasswordEmail('');
          setForgotPasswordSuccess(false);
        }, 3000);
      } else {
        setForgotPasswordError('E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.');
      }
    } catch (error) {
      setForgotPasswordError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

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
          {/* Logo/Brand Section */}
          <View style={styles.brandSection}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[styles.logoText, { color: theme.colors.onPrimaryContainer }]}>
                CF
              </Text>
            </View>
            <Text style={[styles.brandTitle, { color: theme.colors.onSurface }]}>
              CodeFjord Admin
            </Text>
            <Text style={[styles.brandSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Verwaltung & Kontrolle
            </Text>
          </View>

          {/* Login Form */}
          <Surface style={[styles.formSurface, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <Text style={[styles.formTitle, { color: theme.colors.onSurface }]}>
              Anmelden
            </Text>
            <Text style={[styles.formSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Geben Sie Ihre Anmeldedaten ein
            </Text>

            {/* Email Input */}
            <TextInput
              label="E-Mail"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => validateEmail(email)}
              onSubmitEditing={handleEmailSubmit}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              returnKeyType="next"
              error={!!emailError}
              left={<TextInput.Icon icon="email" />}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  error: theme.colors.error,
                }
              }}
            />
            {emailError ? (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            ) : null}

            {/* Password Input */}
            <TextInput
              label="Passwort"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              onSubmitEditing={handlePasswordSubmit}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              autoComplete="password"
              returnKeyType="done"
              error={!!passwordError}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  error: theme.colors.error,
                }
              }}
            />
            {passwordError ? (
              <HelperText type="error" visible={!!passwordError}>
                {passwordError}
              </HelperText>
            ) : null}

            {/* Login Error */}
            {loginError ? (
              <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
                <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                  {loginError}
                </Text>
              </View>
            ) : null}

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading || authLoading}
              disabled={!isFormValid || isLoading || authLoading}
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.loginButtonLabel}
            >
              {isLoading || authLoading ? 'Anmeldung läuft...' : 'Anmelden'}
            </Button>

            {/* Forgot Password Link */}
            <Button
              mode="text"
              onPress={() => setForgotPasswordModal(true)}
              style={styles.forgotPasswordButton}
              labelStyle={[styles.forgotPasswordLabel, { color: theme.colors.primary }]}
            >
              Passwort vergessen?
            </Button>
          </Surface>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
              © 2025 CodeFjord UG (haftungsbeschränkt) i.G. Alle Rechte vorbehalten.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Portal>
        <Modal
          visible={forgotPasswordModal}
          onDismiss={() => {
            setForgotPasswordModal(false);
            setForgotPasswordEmail('');
            setForgotPasswordError('');
            setForgotPasswordSuccess(false);
          }}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          {!forgotPasswordSuccess ? (
            <>
              <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
                Passwort vergessen
              </Title>
              <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
                Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
              </Text>
              
              <TextInput
                mode="outlined"
                label="E-Mail-Adresse"
                value={forgotPasswordEmail}
                onChangeText={setForgotPasswordEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={{ marginBottom: 16 }}
              />
              
              {forgotPasswordError ? (
                <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
                  <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                    {forgotPasswordError}
                  </Text>
                </View>
              ) : null}
              
              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setForgotPasswordModal(false);
                    setForgotPasswordEmail('');
                    setForgotPasswordError('');
                  }}
                  style={{ marginRight: 8 }}
                >
                  Abbrechen
                </Button>
                <Button
                  mode="contained"
                  onPress={handleForgotPassword}
                  loading={forgotPasswordLoading}
                  disabled={!forgotPasswordEmail.trim() || forgotPasswordLoading}
                >
                  Senden
                </Button>
              </View>
            </>
          ) : (
            <>
              <Title style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
                E-Mail gesendet
              </Title>
              <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
                Wir haben Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts gesendet. Bitte überprüfen Sie Ihren Posteingang.
              </Text>
              <Button
                mode="contained"
                onPress={() => {
                  setForgotPasswordModal(false);
                  setForgotPasswordEmail('');
                  setForgotPasswordSuccess(false);
                }}
              >
                Verstanden
              </Button>
            </>
          )}
        </Modal>
      </Portal>
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
  brandSection: {
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
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  formSurface: {
    padding: 32,
    borderRadius: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 8,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    marginTop: 16,
  },
  forgotPasswordLabel: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.7,
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default LoginScreen; 
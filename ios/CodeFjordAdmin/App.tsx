/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { useThemeStore, initializeThemeListener, cleanupThemeListener } from './src/store/themeStore';
import { lightTheme, darkTheme } from './src/theme';

const App = () => {
  const { isLoading, checkAuth } = useAuthStore();
  const { isHydrated, getCurrentTheme } = useThemeStore();

  useEffect(() => {
    checkAuth();
    // Initialize theme listener for system theme changes
    initializeThemeListener();
    
    // Cleanup on unmount
    return () => {
      cleanupThemeListener();
    };
  }, [checkAuth]);

  if (isLoading || !isHydrated) {
    return null;
  }

  const currentThemeMode = getCurrentTheme();
  const currentTheme = currentThemeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={currentTheme}>
        <StatusBar 
          barStyle={currentThemeMode === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor={currentTheme.colors.background} 
        />
        <AppNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;

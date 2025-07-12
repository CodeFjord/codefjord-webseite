import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import BlogScreen from '../screens/BlogScreen';
import PagesScreen from '../screens/PagesScreen';
import TeamScreen from '../screens/TeamScreen';
import ContactScreen from '../screens/ContactScreen';
import MediaScreen from '../screens/MediaScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BlogEditScreen from '../screens/BlogEditScreen';
import PortfolioEditScreen from '../screens/PortfolioEditScreen';
import PagesEditScreen from '../screens/PagesEditScreen';
import TeamEditScreen from '../screens/TeamEditScreen';

// Icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'view-dashboard';
              break;
            case 'Portfolio':
              iconName = 'briefcase';
              break;
            case 'Blog':
              iconName = 'post';
              break;
            case 'Pages':
              iconName = 'file-document';
              break;
            case 'Team':
              iconName = 'account-group';
              break;
            case 'Contact':
              iconName = 'email';
              break;
            case 'Media':
              iconName = 'image';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Blog" component={BlogScreen} />
      <Tab.Screen name="Pages" component={PagesScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Media" component={MediaScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="BlogEdit" component={BlogEditScreen} />
            <Stack.Screen name="PortfolioEdit" component={PortfolioEditScreen} />
            <Stack.Screen name="PagesEdit" component={PagesEditScreen} />
            <Stack.Screen name="TeamEdit" component={TeamEditScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
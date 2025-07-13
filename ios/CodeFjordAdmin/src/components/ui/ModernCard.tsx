import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { shadows } from '../../theme';

interface ModernCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  contentStyle?: any;
  disabled?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  onPress,
  style,
  contentStyle,
  disabled = false,
  variant = 'default',
}) => {
  const theme = useTheme();

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...shadows.md,
          borderColor: 'transparent',
        };
      case 'outlined':
        return {
          ...baseStyle,
          ...shadows.sm,
        };
      default:
        return {
          ...baseStyle,
          ...shadows.sm,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.touchable, style]}
        activeOpacity={0.7}
      >
        <Card style={[getCardStyle(), style]} contentStyle={contentStyle}>
          {children}
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card style={[getCardStyle(), style]} contentStyle={contentStyle}>
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 16,
  },
});

export default ModernCard; 
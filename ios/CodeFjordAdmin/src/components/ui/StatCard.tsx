import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import ModernCard from './ModernCard';
import themeConfig from '../../theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  onPress,
}) => {
  const theme = useTheme();
  const cardColor = color || theme.colors.primary;
  const colors = themeConfig.colors;

  return (
    <ModernCard
      onPress={onPress}
      style={styles.card}
      variant="elevated"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: cardColor + '20' }]}>
            <IconButton
              icon={icon}
              size={24}
              iconColor={cardColor}
              style={styles.icon}
            />
          </View>
          {trend && (
            <View style={[styles.trendContainer, { backgroundColor: trend.isPositive ? colors.success[100] : colors.error[100] }]}>
              <Text style={[styles.trendText, { color: trend.isPositive ? colors.success[700] : colors.error[700] }]}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.stats}>
          <Text style={[styles.value, { color: theme.colors.onSurface }]}>
            {value}
          </Text>
          <Text style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
            {title}
          </Text>
        </View>
      </View>
    </ModernCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    margin: 0,
  },
  trendContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
});

export default StatCard; 
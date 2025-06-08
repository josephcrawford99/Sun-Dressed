import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';
import { Trip } from '@/types/trip';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

interface TripCardProps {
  trip: Trip;
  onDelete: (tripId: string) => Promise<void>;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const includeYear = startYear !== endYear;
    
    const start = startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      ...(includeYear && { year: 'numeric' })
    });
    const end = endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    return `${start} - ${end}`;
  };

  const handleDelete = () => {
    closeMenu();
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete(trip.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete trip');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.tripCard}>
      <View style={styles.cardContent}>
        <View style={styles.tripInfo}>
          <Text style={styles.locationText}>{trip.location}</Text>
          <Text style={styles.dateText}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
        </View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={20}
              onPress={openMenu}
              accessibilityLabel="Open trip options"
              iconColor={theme.colors.gray}
            />
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item 
            onPress={handleDelete} 
            title="Delete" 
            titleStyle={styles.deleteMenuItem}
            leadingIcon="trash-can-outline"
          />
        </Menu>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tripCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripInfo: {
    flex: 1,
  },
  locationText: {
    fontFamily: 'LibreBaskerville_400Regular',
    fontSize: 18,
    fontWeight: '400',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  dateText: {
    ...typography.body,
    fontSize: 14,
    color: theme.colors.gray,
  },
  menuContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
  },
  deleteMenuItem: {
    color: '#FF0000',
    fontSize: 14,
  },
});
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { Trip } from '@/types/trip';
import { theme, typography } from '@/styles';

interface TripCardProps {
  trip: Trip;
  onDelete: (tripId: string) => Promise<void>;
  onEdit: (trip: Trip) => void;
}

const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const startStr = start.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const endStr = end.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  return `${startStr} - ${endStr}`;
};

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete, onEdit }) => {
  console.log('TripCard FULL START render for trip:', trip.id, trip.location);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleEdit = () => {
    console.log('TripCard handleEdit called for trip:', trip.id);
    closeMenu();
    onEdit(trip);
  };

  const handleDelete = async () => {
    console.log('TripCard handleDelete called for trip:', trip.id);
    closeMenu();
    await onDelete(trip.id);
  };

  console.log('TripCard about to render JSX for trip:', trip.id);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.location}>{trip.location}</Text>
        <Text style={styles.dates}>
          {formatDateRange(trip.startDate, trip.endDate)}
        </Text>
      </View>
      
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        contentStyle={styles.menuContent}
        anchor={
          <IconButton
            icon="dots-vertical"
            size={20}
            onPress={openMenu}
            style={styles.menuButton}
            iconColor={theme.colors.gray}
          />
        }
      >
        <Menu.Item 
          onPress={handleEdit} 
          title="Edit"
          leadingIcon="pencil"
          titleStyle={styles.menuItemText}
        />
        <Menu.Item 
          onPress={handleDelete} 
          title="Delete"
          leadingIcon="delete"
          titleStyle={styles.menuItemText}
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  location: {
    ...typography.heading,
    fontSize: 18,
    color: theme.colors.black,
    marginBottom: 4,
  },
  dates: {
    ...typography.body,
    color: theme.colors.gray,
    fontSize: 14,
  },
  menuButton: {
    margin: 0,
  },
  menuContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    marginTop: 8,
  },
  menuItemText: {
    color: theme.colors.black,
    fontSize: 16,
  },
});
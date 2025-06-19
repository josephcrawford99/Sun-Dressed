import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { Trip } from '@/types/trip';
import { theme, typography } from '@/styles';

interface TripCardProps {
  trip: Trip;
  onDelete: (tripId: string) => Promise<void>;
  onEdit: (trip: Trip) => void;
  onViewPackingList: (trip: Trip) => void;
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

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete, onEdit, onViewPackingList }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleCardPress = () => {
    if (!menuVisible) {
      openMenu();
    }
  };

  const handleEdit = () => {
    closeMenu();
    onEdit(trip);
  };

  const handleDelete = async () => {
    closeMenu();
    setIsDeleting(true);
    try {
      await onDelete(trip.id);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={[styles.container, menuVisible && styles.containerWithMenu, isDeleting && styles.containerDeleting]}>
      <TouchableOpacity 
        style={styles.content} 
        onPress={handleCardPress}
        activeOpacity={0.7}
        disabled={isDeleting}
      >
        <Text style={[styles.location, isDeleting && styles.textDeleting]}>{trip.location}</Text>
        <Text style={[styles.dates, isDeleting && styles.textDeleting]}>
          {formatDateRange(trip.startDate, trip.endDate)}
        </Text>
        {isDeleting && <Text style={styles.deletingText}>Deleting...</Text>}
      </TouchableOpacity>
      
      {isDeleting ? (
        <ActivityIndicator size="small" color={theme.colors.black} style={styles.loadingSpinner} />
      ) : (
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
          onPress={() => {
            closeMenu();
            onViewPackingList(trip);
          }} 
          title="View Packing List"
          leadingIcon="bag-suitcase"
          titleStyle={styles.menuItemText}
        />
        <Menu.Item 
          onPress={handleDelete} 
          title="Delete"
          leadingIcon="delete"
          titleStyle={styles.menuItemText}
        />
        </Menu>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  containerWithMenu: {
    zIndex: 1000,
    elevation: 10,
  },
  content: {
    flex: 1,
  },
  location: {
    ...typography.heading,
    fontSize: theme.fontSize.lg,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  dates: {
    ...typography.body,
    color: theme.colors.gray,
    fontSize: theme.fontSize.sm,
  },
  menuButton: {
    margin: 0,
  },
  menuContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.sm,
    elevation: 8,
    zIndex: 1000,
  },
  menuItemText: {
    color: theme.colors.black,
    fontSize: theme.fontSize.md,
  },
  containerDeleting: {
    opacity: 0.6,
  },
  textDeleting: {
    opacity: 0.7,
  },
  deletingText: {
    ...typography.body,
    color: theme.colors.gray,
    fontSize: theme.fontSize.sm,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  loadingSpinner: {
    padding: theme.spacing.sm,
  },
});
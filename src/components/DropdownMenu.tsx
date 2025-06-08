import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

interface DropdownMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  items: DropdownMenuItem[];
  onClose: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  position,
  items,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View 
          style={[
            styles.dropdown, 
            { 
              left: Math.min(position.x - 50, 300), 
              top: position.y + 10 
            }
          ]}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.dropdownItem}
              onPress={() => {
                item.onPress();
                onClose();
              }}
            >
              <Ionicons 
                name={item.icon} 
                size={16} 
                color={item.color || theme.colors.black} 
              />
              <Text style={[styles.dropdownText, { color: item.color || theme.colors.black }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.large,
    minWidth: 120,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  dropdownText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.black,
  },
});
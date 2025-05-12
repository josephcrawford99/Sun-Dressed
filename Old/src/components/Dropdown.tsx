import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Modal, Pressable, FlatList } from 'react-native';

interface DropdownProps<T> {
  visible: boolean;
  options: T[];
  onSelect: (option: T) => void;
  renderOption: (option: T) => React.ReactNode;
  anchorRef?: React.RefObject<any>;
  style?: any;
  onRequestClose?: () => void;
}

function Dropdown<T>({ visible, options, onSelect, renderOption, style, onRequestClose }: DropdownProps<T>) {
  // For MVP, just center below parent, overlay content, and close on outside press
  if (!visible) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <View style={[styles.dropdown, style]}>
          <FlatList
            data={options}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)} style={styles.option}>
                {renderOption(item)}
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.01)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dropdown: {
    marginTop: 100, // You can adjust this or make it dynamic
    minWidth: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    maxHeight: 220,
    zIndex: 100,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});

export default Dropdown;

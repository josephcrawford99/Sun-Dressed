import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

/**
 * Component that renders pagination dots for swipeable content
 */
const PaginationDots: React.FC<PaginationDotsProps> = ({ total, activeIndex }) => {
  // Debug logging
  console.log(`PaginationDots RENDER - Total: ${total}, ActiveIndex: ${activeIndex}`);
  
  // If there's only one item, don't render dots but show debug text
  if (total <= 1) {
    console.log("PaginationDots: Not rendering dots because total <= 1");
    return (
      <View style={styles.container}>
        <Text style={styles.debugText}>Only one outfit available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>Outfits: {total}, Current: {activeIndex + 1}</Text>
      <View style={styles.dotsRow}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // Increased height
    width: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 6, // More spacing between dots
    borderWidth: 1,
    borderColor: '#000',
  },
  activeDot: {
    backgroundColor: '#000', // Black for active dot for maximum visibility
  },
  inactiveDot: {
    backgroundColor: '#DDD', // Light gray for inactive dots
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  }
});

export default PaginationDots;

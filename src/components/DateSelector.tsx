import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { typography } from '../styles/typography';
import { Theme } from '../styles/theme';
import { useTheme } from '../utils/ThemeContext';

interface DateSelectorProps {
  onDateSelect?: (date: Date, index: number) => void;
  selectedIndex?: number;
  startDate?: Date;
  numberOfDays?: number;
}

/**
 * A component for selecting dates in a horizontal scrollable list
 */
const DateSelector: React.FC<DateSelectorProps> = ({
  onDateSelect,
  selectedIndex = 0,
  startDate = new Date(),
  numberOfDays = 7,
}) => {
  const { theme } = useTheme();
  
  // Generate dates
  const dates = Array.from({ length: numberOfDays }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Day name abbreviations
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handleDatePress = (date: Date, index: number) => {
    if (onDateSelect) {
      onDateSelect(date, index);
    }
  };

  return (
    <View style={styles.datesRow}>
      {dates.map((date, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.dateCell, 
            i === selectedIndex && styles.dateCellActive
          ]}
          onPress={() => handleDatePress(date, i)}
        >
          <Text 
            style={[
              typography.caption, 
              i === selectedIndex && styles.dateDayActive
            ]}
          >
            {dayNames[date.getDay()]}
          </Text>
          <Text 
            style={[
              typography.body, 
              i === selectedIndex && styles.dateNumActive
            ]}
          >
            {date.getDate()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  datesRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginHorizontal: 10, 
    marginBottom: 12 
  },
  dateCell: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 44, 
    height: 51, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#F5F5F5', 
    marginHorizontal: 2 
  },
  dateCellActive: { 
    backgroundColor: '#000', 
    borderColor: '#000' 
  },
  dateDayActive: { 
    color: '#fff' 
  },
  dateNumActive: { 
    color: '#fff' 
  },
});

export default DateSelector;

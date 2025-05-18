import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { typography } from '../../styles/typography';

interface WeekCalendarStripProps {
  onDayPress?: (date: Date) => void;
}

const WeekCalendarStrip: React.FC<WeekCalendarStripProps> = ({ onDayPress }) => {
  // Get current date
  const today = new Date();

  // Get the start of the current week (Monday)
  const getWeekDates = (): Date[] => {
    const dates: Date[] = [];
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1; // Adjust for Sunday

    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);

    // Generate array of dates for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  // Format day name to 3 letters
  const formatDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Get date number
  const formatDayNumber = (date: Date): string => {
    return date.getDate().toString();
  };

  // Check if a date is today
  const isToday = (date: Date): boolean => {
    return date.toDateString() === today.toDateString();
  };

  const weekDates = getWeekDates();

  return (
    <View style={styles.datesRow}>
      {weekDates.map((date, i) => (
        <TouchableOpacity
          key={date.toISOString()}
          style={[styles.dateCell, isToday(date) && styles.dateCellActive]}
          onPress={() => onDayPress?.(date)}
        >
          <Text
            style={StyleSheet.flatten([
              typography.caption,
              isToday(date) && styles.dateDayActive
            ])}
          >
            {formatDayName(date)}
          </Text>
          <Text
            style={StyleSheet.flatten([
              typography.body,
              isToday(date) && styles.dateNumActive
            ])}
          >
            {formatDayNumber(date)}
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

export default WeekCalendarStrip;

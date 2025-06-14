import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme, typography } from '@styles';

export type DateOffset = -1 | 0 | 1; // Yesterday, Today, Tomorrow

interface CalendarBarProps {
  selectedDateOffset: DateOffset;
  onDateSelect: (offset: DateOffset) => void;
}

const CalendarBar: React.FC<CalendarBarProps> = ({ selectedDateOffset, onDateSelect }) => {
  // Helper function to get formatted date
  const getFormattedDate = (offset: DateOffset): { day: string; date: string } => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = dayNames[date.getDay()];
    const dateNum = date.getDate().toString();
    
    return { day, date: dateNum };
  };

  const dateOffsets: DateOffset[] = [-1, 0, 1];

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        {dateOffsets.map((offset, index) => {
          const isSelected = selectedDateOffset === offset;
          const { day, date } = getFormattedDate(offset);
          
          return (
            <TouchableOpacity
              key={offset}
              style={[
                styles.dateOption,
                index === 0 && styles.dateOptionLeft,
                index === dateOffsets.length - 1 && styles.dateOptionRight,
                index > 0 && styles.dateOptionBorder,
                isSelected && styles.dateOptionActive
              ]}
              onPress={() => onDateSelect(offset)}
            >
              <View style={styles.dateContent}>
                <Text style={[
                  styles.dayText,
                  isSelected && styles.dayTextActive
                ]}>
                  {day}
                </Text>
                <Text style={[
                  styles.dateText,
                  isSelected && styles.dateTextActive
                ]}>
                  {date}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  calendarContainer: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    overflow: 'hidden',
  },
  dateOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    minHeight: 50,
    justifyContent: 'center',
  },
  dateOptionLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  dateOptionRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  dateOptionBorder: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.gray,
  },
  dateOptionActive: {
    backgroundColor: theme.colors.black,
  },
  dateContent: {
    alignItems: 'center',
    gap: 4,
  },
  dayText: {
    ...typography.caption,
    fontWeight: '600',
    color: theme.colors.gray,
    fontSize: theme.fontSize.xs,
  },
  dayTextActive: {
    color: theme.colors.white,
  },
  dateText: {
    ...typography.button,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.black,
  },
  dateTextActive: {
    color: theme.colors.white,
  },
});

export default CalendarBar;
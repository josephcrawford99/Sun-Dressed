import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';

interface CalendarStripProps {
  onDayPress?: (date: Date) => void;
}

const CalendarStrip: React.FC<CalendarStripProps> = ({
  onDayPress = () => {}
}) => {
  // State to track the current week offset
  const [currentWeek, setCurrentWeek] = useState(0);

  // Navigate to previous/next week
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeek(prev => prev - 1);
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeek(prev => prev + 1);
  }, []);

  // Return to current week
  const goToCurrentWeek = useCallback(() => {
    setCurrentWeek(0);
  }, []);

  // Get the current date
  const today = new Date();

  // Generate week days (Monday through Sunday) based on currentWeek
  const days = React.useMemo(() => {
    const currentDate = new Date();

    // Calculate the Monday of the current week
    const day = currentDate.getDay(); // 0 is Sunday, 1 is Monday
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

    // Set date to Monday of this week
    const mondayOfThisWeek = new Date(currentDate);
    mondayOfThisWeek.setDate(diff);

    // Adjust for the selected week
    mondayOfThisWeek.setDate(mondayOfThisWeek.getDate() + (currentWeek * 7));

    // Generate the 7 days of the week
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(mondayOfThisWeek);
      date.setDate(mondayOfThisWeek.getDate() + i);

      return {
        date,
        dayNumber: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        isToday: date.toDateString() === today.toDateString()
      };
    });
  }, [currentWeek]);

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.outerContainer}>
        {/* Previous week arrow */}
        <TouchableOpacity
          onPress={goToPreviousWeek}
          style={styles.arrowButton}
        >
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>

        {/* Days of the week */}
        <View style={styles.container}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                day.isToday ? styles.todayButton : styles.futureButton
              ]}
              onPress={() => onDayPress(day.date)}
            >
              <Text
                style={[
                  styles.dayName,
                  day.isToday ? styles.todayText : styles.futureText
                ]}
              >
                {day.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  day.isToday ? styles.todayText : styles.futureText
                ]}
              >
                {day.dayNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next week arrow */}
        <TouchableOpacity
          onPress={goToNextWeek}
          style={styles.arrowButton}
        >
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Return to current week button - only shows when not on current week */}
      {currentWeek !== 0 && (
        <TouchableOpacity
          style={styles.returnButton}
          onPress={goToCurrentWeek}
        >
          <Text style={styles.returnButtonText}>Return to Current Week</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
  },
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  arrowButton: {
    width: 24, // Made thinner
    height: 70, // Same height as day buttons
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.black,
  },
  arrowText: {
    fontSize: 18,
    color: '#757575', // Gray color for arrows
  },
  dayButton: {
    flex: 1,
    height: 70,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    maxWidth: 70,
  },
  todayButton: {
    backgroundColor: theme.colors.black,
    borderColor: theme.colors.black,
  },
  futureButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.black,
  },
  dayName: {
    ...typography.caption,
    marginBottom: theme.spacing.xs,
  },
  dayNumber: {
    ...typography.subheading,
  },
  todayText: {
    color: theme.colors.white,
  },
  futureText: {
    color: theme.colors.black,
  },
  returnButton: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.black,
  },
  returnButtonText: {
    ...typography.caption,
    color: theme.colors.black,
  }
});

export default CalendarStrip;

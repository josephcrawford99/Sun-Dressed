import React, { useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Easing 
} from 'react-native';
import { theme } from '../styles/theme';

interface FlipContainerProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
  containerStyle?: object;
}

const FlipContainer: React.FC<FlipContainerProps> = ({
  frontContent,
  backContent,
  isFlipped,
  onFlip,
  containerStyle = {}
}) => {
  const flipAnimation = useRef(new Animated.Value(isFlipped ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [isFlipped, flipAnimation]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 0, 0, 0]
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1]
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View 
        style={[
          styles.card, 
          frontAnimatedStyle, 
          { opacity: frontOpacity },
          styles.frontCard
        ]}
      >
        {frontContent}
      </Animated.View>
      <Animated.View 
        style={[
          styles.card, 
          styles.backCard, 
          backAnimatedStyle, 
          { opacity: backOpacity }
        ]}
      >
        {backContent}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    perspective: 1000,
    height: 370, 
    position: 'relative',
  },
  card: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderRadius: theme.borderRadius.large,
  },
  frontCard: {
    backgroundColor: theme.colors.white,
    zIndex: 1,
  },
  backCard: {
    backgroundColor: '#F5F5F5',
    zIndex: 0,
  }
});

export default FlipContainer;
import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface FlipComponentProps {
  isFlipped: boolean;
  frontComponent: ReactElement;
  backComponent: ReactElement;
  style?: ViewStyle;
  duration?: number;
}

const FlipComponent: React.FC<FlipComponentProps> = ({
  isFlipped,
  frontComponent,
  backComponent,
  style,
  duration = 800,
}) => {
  const rotation = useSharedValue(0);
  const [showBack, setShowBack] = React.useState(false);

  // Update rotation and switch content at midpoint
  React.useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, { duration }, (finished) => {
      if (finished) {
        runOnJS(setShowBack)(isFlipped);
      }
    });
    
    // Switch content at 90 degrees (midpoint)
    const halfDuration = duration / 2;
    const timer = setTimeout(() => {
      setShowBack(isFlipped);
    }, halfDuration);
    
    return () => clearTimeout(timer);
  }, [isFlipped, duration, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value}deg` }
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={[styles.frontContent, { display: showBack ? 'none' : 'flex' }]}>
          {frontComponent}
        </View>
        <View style={[styles.backContent, { display: showBack ? 'flex' : 'none' }]}>
          {backComponent}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
  },
  frontContent: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backContent: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: [{ scaleX: -1 }],
  },
});

export default FlipComponent;
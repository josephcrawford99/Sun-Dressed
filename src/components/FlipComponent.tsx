import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
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

  // Update rotation when isFlipped changes
  React.useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, { duration });
  }, [isFlipped, duration, rotation]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value}deg` }
    ],
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value + 180}deg` }
    ],
    backfaceVisibility: 'hidden',
  }));

  return (
    <View style={[styles.container, style]}>
      {!isFlipped ? (
        <Animated.View style={[styles.card, frontStyle]}>
          {frontComponent}
        </Animated.View>
      ) : (
        <Animated.View style={[styles.card, backStyle]}>
          {backComponent}
        </Animated.View>
      )}
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
    backgroundColor: 'transparent',
  },
});

export default FlipComponent;
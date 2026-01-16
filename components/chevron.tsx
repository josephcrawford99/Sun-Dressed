import { useThemeColor } from "@/hooks/use-theme-color";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";



export function Chevron({ isCollapsed }: { isCollapsed: boolean}) {
    const textColor = useThemeColor({}, 'text');
    const rotateAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isCollapsed ? 0 : 180,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
    }, [rotateAnim, isCollapsed]);
    const rotation = rotateAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '-180deg'],
    });
    return (
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <MaterialCommunityIcons name="chevron-down" size={26} color={textColor} />
        </Animated.View>
    );
}

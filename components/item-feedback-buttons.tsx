import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useStore } from '@/store/store';
import { ClothingItem } from '@/types/outfit';

type ItemFeedbackButtonsProps = {
  item: ClothingItem;
};

export function ItemFeedbackButtons({ item }: ItemFeedbackButtonsProps) {
  const feedback = useStore((state) => state.itemFeedback[item.name]);
  const approveItem = useStore((state) => state.approveItem);
  const disapproveItem = useStore((state) => state.disapproveItem);
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.row}>
      <Pressable onPress={() => approveItem(item)} hitSlop={8}>
        <Ionicons
          name="thumbs-up-sharp"
          size={20}
          color={feedback === 'up' ? '#4CAF50' : textColor}
          style={{ opacity: feedback === 'up' ? 1 : 0.35 }}
        />
      </Pressable>
      <Pressable onPress={() => disapproveItem(item)} hitSlop={8}>
        <Ionicons
          name="thumbs-down-sharp"
          size={20}
          color={feedback === 'down' ? '#EF5350' : textColor}
          style={{ opacity: feedback === 'down' ? 1 : 0.35 }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
});

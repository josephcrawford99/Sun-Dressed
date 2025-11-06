import { useMemo } from 'react';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

import { useThemeColor } from '@/hooks/use-theme-color';

export type RadioOption = {
  id: string;
  label: string;
  value: string;
};

export type ThemedRadioGroupProps = {
  options: RadioOption[];
  selectedId?: string;
  onPress: (selectedId: string) => void;
};

export function ThemedRadioGroup({ options, selectedId, onPress }: ThemedRadioGroupProps) {
  const textColor = useThemeColor({}, 'text');

  const radioButtons: RadioButtonProps[] = useMemo(
    () =>
      options.map((option) => ({
        id: option.id,
        label: option.label,
        value: option.value,
        color: textColor,
        labelStyle: { color: textColor },
      })),
    [options, textColor]
  );

  return (
    <RadioGroup radioButtons={radioButtons} onPress={onPress} selectedId={selectedId} />
  );
}

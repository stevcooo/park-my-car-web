import { StyleSheet, Text } from 'react-native';
import { OptionGrid } from '../components/OptionGrid';
import { Screen } from '../components/Screen';
import type { Duration } from '../data/providers';
import { colors } from '../theme';

type Props = {
  durations: Duration[];
  selected: Duration | null;
  onSelect: (duration: Duration) => void;
  onBack: () => void;
  onSend: () => void;
};

export function SelectDurationScreen({ durations, selected, onSelect, onBack, onSend }: Props) {
  return (
    <Screen
      title="Период"
      back={{ label: 'Назад', onPress: onBack }}
      next={{ label: 'SMS', onPress: onSend, disabled: selected === null }}>
      <OptionGrid
        items={durations}
        keyOf={(d) => d.code}
        selectedKey={selected?.code}
        onSelect={onSelect}
        render={(d) => <Text style={styles.label}>{d.name}</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 18, fontWeight: '600', color: colors.text },
});

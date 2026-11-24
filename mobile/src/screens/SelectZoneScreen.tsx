import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { OptionGrid } from '../components/OptionGrid';
import { Screen } from '../components/Screen';
import { isZoneGroup, zoneLabel, type Provider, type Zone, type ZoneItem } from '../data/providers';
import { colors } from '../theme';

type Props = {
  provider: Provider;
  selected: Zone | null;
  onSelect: (zone: Zone) => void;
  onBack: () => void;
  /** Shown for start/stop providers, where the zone is the last choice. */
  onSend?: () => void;
};

/** Zones may be grouped (Gradski: A, B, C, D); a group drills into its children. */
export function SelectZoneScreen({ provider, selected, onSelect, onBack, onSend }: Props) {
  const [items, setItems] = useState<ZoneItem[]>(provider.zones);
  const inGroup = items !== provider.zones;

  const choose = (item: ZoneItem) => {
    if (isZoneGroup(item)) {
      setItems(item.children);
      return;
    }
    onSelect(item);
  };

  const back = inGroup ? () => setItems(provider.zones) : onBack;

  return (
    <Screen
      title="Зона"
      back={{ label: 'Назад', onPress: back }}
      next={onSend ? { label: 'SMS', onPress: onSend, disabled: selected === null } : undefined}>
      <OptionGrid
        items={items}
        keyOf={(z) => (isZoneGroup(z) ? `group:${z.name}` : z.code)}
        selectedKey={selected?.code}
        onSelect={choose}
        render={(z) => (
          <Text style={styles.label}>{isZoneGroup(z) ? z.name : zoneLabel(z)}</Text>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 18, fontWeight: '600', color: colors.text },
});

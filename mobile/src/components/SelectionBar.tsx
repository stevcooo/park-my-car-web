import { Image, StyleSheet, Text, View } from 'react-native';
import type { Duration, Provider, Zone } from '../data/providers';
import type { Vehicle } from '../storage/vehicles';
import { colors, spacing } from '../theme';

type Props = {
  vehicle: Vehicle | null;
  provider: Provider | null;
  zone: Zone | null;
  duration: Duration | null;
};

/** The chips along the top showing what has been picked so far. */
export function SelectionBar({ vehicle, provider, zone, duration }: Props) {
  if (!vehicle && !provider && !zone && !duration) return null;
  return (
    <View style={styles.bar}>
      {vehicle && (
        <View style={styles.chip}>
          <Text style={styles.label}>Регистрација</Text>
          <Text style={styles.value}>{vehicle.plate}</Text>
        </View>
      )}
      {provider && (
        <View style={styles.chip}>
          <Text style={styles.label}>Паркинг</Text>
          <Image source={provider.logo} style={styles.logo} resizeMode="contain" />
        </View>
      )}
      {zone && (
        <View style={styles.chip}>
          <Text style={styles.label}>Зона</Text>
          <Text style={styles.value}>{zone.code}</Text>
        </View>
      )}
      {duration && (
        <View style={styles.chip}>
          <Text style={styles.label}>Време</Text>
          <Text style={styles.value}>{duration.name}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  chip: {
    flex: 1,
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  label: { fontSize: 11, color: colors.muted },
  value: { fontSize: 14, fontWeight: '600', color: colors.text },
  logo: { width: 48, height: 28 },
});

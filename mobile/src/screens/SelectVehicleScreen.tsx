import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { OptionGrid } from '../components/OptionGrid';
import { Screen } from '../components/Screen';
import { getVehicles, removeVehicle, type Vehicle } from '../storage/vehicles';
import { colors } from '../theme';

type Props = {
  onSelect: (vehicle: Vehicle) => void;
  onAdd: () => void;
  onSettings: () => void;
};

export function SelectVehicleScreen({ onSelect, onAdd, onSettings }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    getVehicles().then(setVehicles);
  }, []);

  const remove = useCallback(async (id: string) => {
    setVehicles(await removeVehicle(id));
  }, []);

  return (
    <Screen
      title="Возило"
      headerAction={{ label: 'Поставки', onPress: onSettings }}
      next={{ label: '+ Додади ново возило', onPress: onAdd }}>
      <OptionGrid
        items={vehicles}
        keyOf={(v) => v.id}
        onSelect={onSelect}
        render={(v) => (
          <>
            <Text style={styles.name}>{v.name}</Text>
            <Text style={styles.plate}>{v.plate}</Text>
          </>
        )}
        corner={(v) => (
          <Pressable
            onPress={() => remove(v.id)}
            hitSlop={8}
            style={styles.remove}
            accessibilityLabel={`Отстрани ${v.name}`}>
            <Text style={styles.removeLabel}>×</Text>
          </Pressable>
        )}
      />
      {vehicles.length === 0 && <Text style={styles.empty}>Нема возила. Додади едно.</Text>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 16, color: colors.text },
  plate: { fontSize: 16, fontWeight: '600', color: colors.text },
  remove: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLabel: { color: colors.textOnDark, fontSize: 14, lineHeight: 16 },
  empty: { color: colors.muted },
});

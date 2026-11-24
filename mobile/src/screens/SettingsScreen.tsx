import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import {
  type BondedDevice,
  isCarBluetoothSupported,
  listPairedDevices,
} from '../services/carBluetooth';
import { GEOFENCE_RADIUS_METERS } from '../services/geofence';
import { bluetoothTriggerPlatformNote } from '../services/leaveTriggers';
import type { Settings } from '../storage/settings';
import { colors, spacing } from '../theme';

type Props = {
  settings: Settings;
  onPickCar: (device: BondedDevice | null) => void;
  /** Resolves once permission has been handled and the setting saved. */
  onToggleGeofence: (enabled: boolean) => Promise<void>;
  onBack: () => void;
};

/** Which paired device is the car, and whether to watch location. */
export function SettingsScreen({ settings, onPickCar, onToggleGeofence, onBack }: Props) {
  const [devices, setDevices] = useState<BondedDevice[] | null>(null);
  const [busy, setBusy] = useState(false);

  const loadDevices = useCallback(async () => {
    setBusy(true);
    try {
      setDevices(await listPairedDevices());
    } finally {
      setBusy(false);
    }
  }, []);

  const toggleGeofence = useCallback(
    async (enabled: boolean) => {
      setBusy(true);
      try {
        await onToggleGeofence(enabled);
      } finally {
        setBusy(false);
      }
    },
    [onToggleGeofence],
  );

  return (
    <Screen title="Поставки" back={{ label: 'Назад', onPress: onBack }}>
      <Text style={styles.section}>Потсетник кога заминуваш</Text>
      <Text style={styles.help}>
        Кај Градски паркинг апликацијата може да те потсети да испратиш стоп во моментот кога
        најверојатно го напушташ паркингот, наместо само на секој час.
      </Text>

      <Text style={styles.subsection}>Bluetooth на автомобилот</Text>
      {isCarBluetoothSupported() ? (
        <>
          <Text style={styles.help}>
            Кога телефонот ќе се поврзе со избраниот уред додека има активен паркинг, веднаш
            добиваш потсетник со копче „Стопирај паркинг“.
          </Text>
          <Text style={styles.current}>
            Избрано: {settings.carDevice ? settings.carDevice.name : 'ништо'}
          </Text>
          {devices === null ? (
            <Pressable onPress={loadDevices} disabled={busy} style={styles.button}>
              <Text style={styles.buttonLabel}>Избери од спарените уреди</Text>
            </Pressable>
          ) : devices.length === 0 ? (
            <Text style={styles.help}>Нема спарени уреди или дозволата е одбиена.</Text>
          ) : (
            <View style={styles.list}>
              <DeviceRow
                label="Ништо"
                selected={!settings.carDevice}
                onPress={() => onPickCar(null)}
              />
              {devices.map((d) => (
                <DeviceRow
                  key={d.address}
                  label={d.name}
                  detail={d.address}
                  selected={settings.carDevice?.address === d.address}
                  onPress={() => onPickCar(d)}
                />
              ))}
            </View>
          )}
        </>
      ) : (
        <Text style={styles.help}>{bluetoothTriggerPlatformNote ?? 'Не е достапно на овој уред.'}</Text>
      )}

      <Text style={styles.subsection}>Локација</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Потсети ме кога ќе се оддалечам</Text>
        <Switch
          value={settings.geofenceEnabled}
          onValueChange={toggleGeofence}
          disabled={busy}
          trackColor={{ true: colors.primary }}
        />
      </View>
      <Text style={styles.help}>
        При почеток на паркинг се памети локацијата, а кога телефонот ќе излезе од круг од{' '}
        {GEOFENCE_RADIUS_METERS} m добиваш потсетник. Потребна е дозвола за локација „Секогаш“.
        Може да се активира и ако само се оддалечиш пешки, па провери дали навистина заминуваш.
      </Text>
    </Screen>
  );
}

function DeviceRow({
  label,
  detail,
  selected,
  onPress,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && styles.rowSelected]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {detail && <Text style={styles.rowDetail}>{detail}</Text>}
      </View>
      <Text style={styles.rowMark}>{selected ? '●' : '○'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  subsection: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  help: { color: colors.muted, fontSize: 14, marginBottom: spacing.sm },
  current: { color: colors.text, fontSize: 16, marginBottom: spacing.sm },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    padding: spacing.md,
    alignItems: 'center',
  },
  buttonLabel: { color: colors.textOnDark, fontSize: 16 },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.field,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: spacing.md,
  },
  rowSelected: { borderColor: colors.primary, backgroundColor: colors.background },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, color: colors.text },
  rowDetail: { fontSize: 12, color: colors.muted },
  rowMark: { fontSize: 18, color: colors.primary },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  switchLabel: { fontSize: 16, color: colors.text, flex: 1, marginRight: spacing.md },
});

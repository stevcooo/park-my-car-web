import { useEffect, useState } from 'react';
import { Image, StyleSheet, Switch, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { isPrepaid, providerById } from '../data/providers';
import { GEOFENCE_RADIUS_METERS } from '../services/geofence';
import type { LeaveTriggerStatus } from '../services/leaveTriggers';
import type { ParkingSession } from '../storage/session';
import { colors, spacing } from '../theme';

type Props = {
  session: ParkingSession;
  /** Which leaving triggers are armed; null while loading. */
  triggers: LeaveTriggerStatus | null;
  /** Opens the SMS compose sheet with the provider's stop command. */
  onStop: () => void;
  /** Ends the session locally without sending anything. */
  onDismiss: () => void;
  onToggleGeofence: (enabled: boolean) => Promise<void>;
  onSettings: () => void;
};

function formatTime(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit' });
}

function formatElapsed(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
}

export function ActiveSessionScreen({
  session,
  triggers,
  onStop,
  onDismiss,
  onToggleGeofence,
  onSettings,
}: Props) {
  const provider = providerById(session.providerId);
  const prepaid = isPrepaid(provider);
  const [now, setNow] = useState(() => Date.now());
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const expired = session.endsAt !== undefined && now >= session.endsAt;

  const toggleGeofence = async (enabled: boolean) => {
    setToggling(true);
    try {
      await onToggleGeofence(enabled);
    } finally {
      setToggling(false);
    }
  };

  return (
    <Screen
      title="Активен паркинг"
      headerAction={prepaid ? undefined : { label: 'Поставки', onPress: onSettings }}
      back={{ label: prepaid ? 'Заврши' : 'Заврши без SMS', onPress: onDismiss }}
      next={
        prepaid ? undefined : { label: `Стоп (SMS „${provider.stopCommand ?? 's'}“)`, onPress: onStop }
      }>
      <View style={styles.card}>
        <Image source={provider.logo} style={styles.logo} resizeMode="contain" />
        <Row label="Возило" value={`${session.vehicle.name} · ${session.vehicle.plate}`} />
        <Row label="Зона" value={session.zoneCode} />
        <Row label="Почеток" value={formatTime(session.startedAt)} />
        {session.endsAt ? (
          <Row
            label={expired ? 'Истече во' : 'Истекува во'}
            value={formatTime(session.endsAt)}
            highlight={expired}
          />
        ) : (
          <Row label="Траење" value={formatElapsed(now - session.startedAt)} />
        )}
      </View>
      <Text style={styles.hint}>
        {prepaid
          ? 'Ќе добиеш потсетник 10 минути пред да истече платеното време.'
          : `Ќе добиваш потсетник на секој час додека не испратиш „${provider.stopCommand ?? 's'}“ на ${provider.number}.`}
      </Text>
      {!prepaid && (
        <View style={styles.triggers}>
          <Text style={styles.triggersTitle}>Потсетник кога заминуваш</Text>
          <Row label="Bluetooth" value={bluetoothLabel(triggers)} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Локација</Text>
            <View style={styles.switchCell}>
              <Text style={styles.rowValue}>{geofenceLabel(triggers, session)}</Text>
              <Switch
                value={triggers?.geofence.enabled ?? false}
                onValueChange={toggleGeofence}
                disabled={triggers === null || toggling}
                trackColor={{ true: colors.primary }}
              />
            </View>
          </View>
          {triggers?.geofence.armed && (
            <Text style={styles.triggersHint}>
              Се активира кога ќе излезеш од круг од {GEOFENCE_RADIUS_METERS} m околу
              автомобилот, и ако си пешки.
            </Text>
          )}
        </View>
      )}
    </Screen>
  );
}

function bluetoothLabel(triggers: LeaveTriggerStatus | null): string {
  if (!triggers) return '…';
  switch (triggers.bluetooth.kind) {
    case 'armed':
      return `чека ${triggers.bluetooth.device}`;
    case 'no-device':
      return 'не е избран автомобил';
    case 'unsupported':
      return 'само Android';
  }
}

function geofenceLabel(triggers: LeaveTriggerStatus | null, session: ParkingSession): string {
  if (!triggers) return '…';
  if (!triggers.geofence.enabled) return 'исклучено';
  if (triggers.geofence.armed && session.location) return 'активно';
  return 'не е активно';
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.field,
    borderRadius: 4,
    padding: spacing.md,
    gap: spacing.sm,
  },
  logo: { width: '100%', height: 60, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: colors.muted, fontSize: 16 },
  rowValue: { color: colors.text, fontSize: 16, fontWeight: '600' },
  rowHighlight: { color: colors.danger },
  hint: { marginTop: spacing.lg, color: colors.muted, fontSize: 14 },
  triggers: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  triggersTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  triggersHint: { color: colors.muted, fontSize: 13 },
  switchCell: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});

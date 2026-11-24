import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SelectionBar } from './src/components/SelectionBar';
import {
  isPrepaid,
  providerById,
  startSmsText,
  type Duration,
  type Provider,
  type Zone
} from './src/data/providers';
import { ActiveSessionScreen } from './src/screens/ActiveSessionScreen';
import { AddVehicleScreen } from './src/screens/AddVehicleScreen';
import { SelectDurationScreen } from './src/screens/SelectDurationScreen';
import { SelectProviderScreen } from './src/screens/SelectProviderScreen';
import { SelectVehicleScreen } from './src/screens/SelectVehicleScreen';
import { SelectZoneScreen } from './src/screens/SelectZoneScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { armCarBluetooth, disarmCarBluetooth, type BondedDevice } from './src/services/carBluetooth';
import { armGeofence, disarmGeofence, requestGeofencePermission } from './src/services/geofence';
import {
  armLeaveTriggers,
  disarmLeaveTriggers,
  type LeaveTriggerStatus,
  leaveTriggerStatus
} from './src/services/leaveTriggers';
import {
  cancelReminders,
  ensureNotificationPermission,
  scheduleReminders,
  setupNotifications,
  STOP_ACTION
} from './src/services/reminders';
import { composeSms, type SmsOutcome } from './src/services/sms';
import { clearSession, loadSession, saveSession, type ParkingSession } from './src/storage/session';
import { loadSettings, saveSettings, type Settings } from './src/storage/settings';
import type { Vehicle } from './src/storage/vehicles';
import { colors } from './src/theme';

type Step =
  | 'loading'
  | 'vehicle'
  | 'addVehicle'
  | 'provider'
  | 'zone'
  | 'duration'
  | 'active'
  | 'settings';

/**
 * iOS tells us whether the compose sheet was sent or cancelled. Android does
 * not, so there we ask. Resolves true when the message is believed sent.
 */
async function confirmSent(outcome: SmsOutcome): Promise<boolean> {
  if (outcome === 'sent') return true;
  if (outcome === 'cancelled') return false;
  if (outcome === 'unavailable') {
    Alert.alert('SMS не е достапно', 'Овој уред не може да испраќа SMS пораки.');
    return false;
  }
  return new Promise((resolve) => {
    Alert.alert('Дали ја испрати пораката?', undefined, [
      { text: 'Не', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Да', onPress: () => resolve(true) }
    ]);
  });
}

/** Background location needs the "Always" / "Allow all the time" choice, which lives in system settings. */
function explainBackgroundLocation(): void {
  Alert.alert(
    'Потребна е локација „Секогаш“',
    Platform.OS === 'ios'
      ? 'Во Поставки > Park My Car > Локација избери „Секогаш“.'
      : 'Во поставките на апликацијата избери „Дозволи цело време“ за локација.',
    [
      { text: 'Откажи', style: 'cancel' },
      { text: 'Отвори поставки', onPress: () => Linking.openSettings() }
    ]
  );
}

export default function App() {
  const [step, setStep] = useState<Step>('loading');
  const [session, setSession] = useState<ParkingSession | null>(null);
  const [settings, setSettings] = useState<Settings>({ geofenceEnabled: false });
  const [triggers, setTriggers] = useState<LeaveTriggerStatus | null>(null);
  /** Where "Back" on the settings screen returns to. */
  const [settingsReturnTo, setSettingsReturnTo] = useState<Step>('vehicle');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [zone, setZone] = useState<Zone | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);

  const resetWizard = useCallback(() => {
    setVehicle(null);
    setProvider(null);
    setZone(null);
    setDuration(null);
    setStep('vehicle');
  }, []);

  const endSession = useCallback(
    async (current: ParkingSession) => {
      await cancelReminders(current.reminderIds);
      await disarmLeaveTriggers();
      await clearSession();
      setSession(null);
      resetWizard();
    },
    [resetWizard]
  );

  const refreshTriggers = useCallback(async (current: Settings) => {
    setTriggers(await leaveTriggerStatus(current));
  }, []);

  const stopSession = useCallback(
    async (current: ParkingSession) => {
      const p = providerById(current.providerId);
      if (!p.stopCommand) {
        await endSession(current);
        return;
      }
      const outcome = await composeSms(p.number, p.stopCommand);
      if (await confirmSent(outcome)) await endSession(current);
    },
    [endSession]
  );

  // Boot: notification setup, restore an active session, react to notification taps.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await setupNotifications();
      const [restored, stored] = await Promise.all([loadSession(), loadSettings()]);
      if (cancelled) return;
      setSettings(stored);
      setSession(restored);
      setStep(restored ? 'active' : 'vehicle');
      await refreshTriggers(stored);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshTriggers]);

  useEffect(() => {
    const onResponse = async (response: Notifications.NotificationResponse) => {
      const current = await loadSession();
      if (!current) return;
      setSession(current);
      setStep('active');
      if (response.actionIdentifier === STOP_ACTION) await stopSession(current);
    };
    const subscription = Notifications.addNotificationResponseReceivedListener(onResponse);
    // The tap that launched the app from a killed state is not delivered to the listener.
    Notifications.getLastNotificationResponseAsync().then((r) => r && onResponse(r));
    return () => subscription.remove();
  }, [stopSession]);

  const startParking = useCallback(async () => {
    if (!vehicle || !provider || !zone) return;
    if (isPrepaid(provider) && !duration) return;

    const outcome = await composeSms(
      provider.number,
      startSmsText(zone.code, vehicle.plate, duration ?? undefined)
    );
    if (!(await confirmSent(outcome))) return;

    const startedAt = Date.now();
    const next: ParkingSession = {
      id: `${startedAt}`,
      vehicle,
      providerId: provider.id,
      zoneCode: zone.code,
      durationHours: duration?.hours,
      startedAt,
      endsAt: duration ? startedAt + duration.hours * 3600 * 1000 : undefined,
      reminderIds: []
    };
    if (await ensureNotificationPermission()) {
      next.reminderIds = await scheduleReminders(next, provider);
    }
    await saveSession(next);
    setSession(next);
    setStep('active');
    setSession(await armLeaveTriggers(next, provider, settings));
    await refreshTriggers(settings);
  }, [vehicle, provider, zone, duration, settings, refreshTriggers]);

  const openSettings = useCallback(() => {
    setSettingsReturnTo(step);
    setStep('settings');
  }, [step]);

  /** Turning it on asks for permission; with an active start/stop session it also arms right away. */
  const toggleGeofence = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        const permission = await requestGeofencePermission();
        if (permission !== 'granted') {
          if (permission === 'foreground-only') explainBackgroundLocation();
          else Alert.alert('Без дозвола за локација', 'Потсетникот по локација не може да работи.');
          return;
        }
      }
      const next = await saveSettings({ geofenceEnabled: enabled });
      setSettings(next);
      if (session && providerById(session.providerId).stopCommand) {
        if (enabled) {
          const location = await armGeofence(session);
          if (location) {
            const updated = { ...session, location };
            await saveSession(updated);
            setSession(updated);
          } else {
            Alert.alert('Нема локација', 'Не успеав да ја одредам позицијата. Обиди се повторно.');
          }
        } else {
          await disarmGeofence();
        }
      }
      await refreshTriggers(next);
    },
    [session, refreshTriggers]
  );

  const pickCar = useCallback(
    async (device: BondedDevice | null) => {
      const next = await saveSettings({ carDevice: device ?? undefined });
      setSettings(next);
      if (session) {
        const p = providerById(session.providerId);
        if (device && p.stopCommand) armCarBluetooth(session, p, device);
        else disarmCarBluetooth();
      }
      await refreshTriggers(next);
    },
    [session, refreshTriggers]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar style="dark" />
        {step !== 'active' && (
          <SelectionBar vehicle={vehicle} provider={provider} zone={zone} duration={duration} />
        )}
        {step === 'vehicle' && (
          <SelectVehicleScreen
            onSelect={(v) => {
              setVehicle(v);
              setStep('provider');
            }}
            onAdd={() => setStep('addVehicle')}
            onSettings={openSettings}
          />
        )}
        {step === 'settings' && (
          <SettingsScreen
            settings={settings}
            onPickCar={pickCar}
            onToggleGeofence={toggleGeofence}
            onBack={() => setStep(settingsReturnTo)}
          />
        )}
        {step === 'addVehicle' && (
          <AddVehicleScreen
            onAdded={() => setStep('vehicle')}
            onCancel={() => setStep('vehicle')}
          />
        )}
        {step === 'provider' && (
          <SelectProviderScreen
            onSelect={(p) => {
              setProvider(p);
              setStep('zone');
            }}
            onBack={() => {
              setVehicle(null);
              setStep('vehicle');
            }}
          />
        )}
        {step === 'zone' && provider && (
          <SelectZoneScreen
            provider={provider}
            selected={zone}
            onSelect={(z) => {
              setZone(z);
              if (isPrepaid(provider)) setStep('duration');
            }}
            onBack={() => {
              setProvider(null);
              setZone(null);
              setStep('provider');
            }}
            onSend={isPrepaid(provider) ? undefined : startParking}
          />
        )}
        {step === 'duration' && provider && (
          <SelectDurationScreen
            durations={provider.durations}
            selected={duration}
            onSelect={setDuration}
            onBack={() => {
              setZone(null);
              setDuration(null);
              setStep('zone');
            }}
            onSend={startParking}
          />
        )}
        {step === 'active' && session && (
          <ActiveSessionScreen
            session={session}
            triggers={triggers}
            onToggleGeofence={toggleGeofence}
            onSettings={openSettings}
            onStop={() => stopSession(session)}
            onDismiss={() =>
              Alert.alert('Заврши го паркингот?', 'Нема да се испрати SMS.', [
                { text: 'Откажи', style: 'cancel' },
                { text: 'Заврши', style: 'destructive', onPress: () => endSession(session) }
              ])
            }
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background }
});

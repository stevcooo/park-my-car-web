import { Platform } from 'react-native';
import type { Provider } from '../data/providers';
import { saveSession, type ParkingSession } from '../storage/session';
import type { Settings } from '../storage/settings';
import {
  armCarBluetooth,
  disarmCarBluetooth,
  isCarBluetoothArmed,
  isCarBluetoothSupported,
} from './carBluetooth';
import { armGeofence, disarmGeofence, isGeofenceArmed } from './geofence';

/** What the active-session screen shows under "Leaving detection". */
export type LeaveTriggerStatus = {
  bluetooth:
    | { kind: 'armed'; device: string }
    | { kind: 'no-device' }
    | { kind: 'unsupported' };
  geofence: { enabled: boolean; armed: boolean };
};

/**
 * Arms whichever triggers the settings turn on. Only start/stop providers
 * have anything to stop, so prepaid sessions arm nothing.
 */
export async function armLeaveTriggers(
  session: ParkingSession,
  provider: Provider,
  settings: Settings,
): Promise<ParkingSession> {
  if (!provider.stopCommand) return session;
  if (settings.carDevice && isCarBluetoothSupported()) {
    armCarBluetooth(session, provider, settings.carDevice);
  }
  if (settings.geofenceEnabled) {
    const location = await armGeofence(session);
    if (location) {
      const next = { ...session, location };
      await saveSession(next);
      return next;
    }
  }
  return session;
}

export async function disarmLeaveTriggers(): Promise<void> {
  disarmCarBluetooth();
  await disarmGeofence();
}

export async function leaveTriggerStatus(settings: Settings): Promise<LeaveTriggerStatus> {
  let bluetooth: LeaveTriggerStatus['bluetooth'];
  if (!isCarBluetoothSupported()) {
    bluetooth = { kind: 'unsupported' };
  } else if (settings.carDevice && isCarBluetoothArmed()) {
    bluetooth = { kind: 'armed', device: settings.carDevice.name };
  } else {
    bluetooth = { kind: 'no-device' };
  }
  return {
    bluetooth,
    geofence: { enabled: settings.geofenceEnabled, armed: await isGeofenceArmed() },
  };
}

/** iOS has no app-visible car Bluetooth; the README describes the Shortcuts route. */
export const bluetoothTriggerPlatformNote =
  Platform.OS === 'ios'
    ? 'iOS не дозволува апликации да го гледаат Bluetooth на автомобилот. Види Shortcuts во README.'
    : null;

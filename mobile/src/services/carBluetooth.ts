import { PermissionsAndroid, Platform } from 'react-native';
import { type BondedDevice, CarBluetooth } from '../../modules/car-bluetooth';
import type { Provider } from '../data/providers';
import type { ParkingSession } from '../storage/session';
import { CHANNEL, leaveReminderContent, STOP_CATEGORY } from './reminders';

export type { BondedDevice };

/** True on Android builds that include the native module. */
export function isCarBluetoothSupported(): boolean {
  return Platform.OS === 'android' && CarBluetooth !== null;
}

/** Android 12+ gates paired-device access and the connect broadcast behind a runtime permission. */
export async function ensureBluetoothPermission(): Promise<boolean> {
  if (!isCarBluetoothSupported()) return false;
  if (Platform.OS !== 'android' || Platform.Version < 31) return true;
  const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
  return status === PermissionsAndroid.RESULTS.GRANTED;
}

/** Paired devices to choose the car from. Empty when unsupported or not permitted. */
export async function listPairedDevices(): Promise<BondedDevice[]> {
  if (!CarBluetooth || !(await ensureBluetoothPermission())) return [];
  return CarBluetooth.getBondedDevices();
}

/** Tell the native receiver which device to watch and what to say when it connects. */
export function armCarBluetooth(
  session: ParkingSession,
  provider: Provider,
  device: { address: string },
): void {
  if (!CarBluetooth) return;
  CarBluetooth.arm({
    address: device.address,
    ...leaveReminderContent(session, provider, 'bluetooth'),
    channelId: CHANNEL,
    categoryId: STOP_CATEGORY,
  });
}

export function disarmCarBluetooth(): void {
  CarBluetooth?.disarm();
}

export function isCarBluetoothArmed(): boolean {
  return (CarBluetooth?.armedAddress() ?? null) !== null;
}

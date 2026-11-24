import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProviderId } from '../data/providers';
import type { Vehicle } from './vehicles';

/** The one parking session that is currently paid for, if any. */
export type ParkingSession = {
  id: string;
  vehicle: Vehicle;
  providerId: ProviderId;
  zoneCode: string;
  /** Set for prepaid providers only. */
  durationHours?: number;
  /** Epoch ms. */
  startedAt: number;
  /** Epoch ms, prepaid providers only. */
  endsAt?: number;
  /** Scheduled local notification ids, so they can be cancelled on stop. */
  reminderIds: string[];
  /** Where the car was parked, when the geofence trigger recorded it. */
  location?: { latitude: number; longitude: number };
};

const KEY = 'activeSession';

export async function loadSession(): Promise<ParkingSession | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as ParkingSession;
  } catch {
    await AsyncStorage.removeItem(KEY);
    return null;
  }
}

export async function saveSession(session: ParkingSession): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

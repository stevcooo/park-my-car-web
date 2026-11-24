import AsyncStorage from '@react-native-async-storage/async-storage';

/** Options for the "you probably left the parking spot" triggers. */
export type Settings = {
  /** The paired Bluetooth device that is the car (Android only). */
  carDevice?: { name: string; address: string };
  /** Post the stop reminder when the phone leaves a geofence around the spot. */
  geofenceEnabled: boolean;
};

const KEY = 'settings';
const defaults: Settings = { geofenceEnabled: false };

export async function loadSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw === null) return defaults;
  try {
    return { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return defaults;
  }
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await loadSettings()), ...patch };
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

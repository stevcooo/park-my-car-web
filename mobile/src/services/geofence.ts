import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { providerById } from '../data/providers';
import { loadSession, type ParkingSession } from '../storage/session';
import { presentLeaveReminder } from './reminders';

export const GEOFENCE_TASK = 'parking-geofence';
/** Big enough to swallow GPS drift in a street canyon, small enough to fire before you drive off. */
export const GEOFENCE_RADIUS_METERS = 150;
const FIX_TIMEOUT_MS = 15000;

type GeofenceEvent = { eventType: Location.GeofencingEventType; region: Location.LocationRegion };

// Must run at module scope: when the OS wakes the app for a geofence event
// no component is mounted. App.tsx imports this file, so it runs at startup.
TaskManager.defineTask<GeofenceEvent>(GEOFENCE_TASK, async ({ data, error }) => {
  if (error || !data) return;
  if (data.eventType !== Location.GeofencingEventType.Exit) return;
  const session = await loadSession();
  if (!session || session.id !== data.region.identifier) {
    await disarmGeofence();
    return;
  }
  await presentLeaveReminder(session, providerById(session.providerId), 'geofence');
  // One reminder per session. The hourly nag keeps going if it is ignored.
  await disarmGeofence();
});

export type GeofencePermission = 'granted' | 'foreground-only' | 'denied';

/**
 * Foreground first, then background ("Always"). Android 11+ sends the user to
 * the settings page for the second step, so call this from a tap, not on boot.
 */
export async function requestGeofencePermission(): Promise<GeofencePermission> {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (!fg.granted) return 'denied';
  const bg = await Location.requestBackgroundPermissionsAsync();
  return bg.granted ? 'granted' : 'foreground-only';
}

export async function hasGeofencePermission(): Promise<boolean> {
  const bg = await Location.getBackgroundPermissionsAsync();
  return bg.granted;
}

async function currentPosition(): Promise<Location.LocationObject | null> {
  const fresh = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), FIX_TIMEOUT_MS));
  const fix = await Promise.race([fresh.catch(() => null), timeout]);
  if (fix) return fix;
  return Location.getLastKnownPositionAsync({ maxAge: 5 * 60 * 1000 });
}

/**
 * Records where the car is and starts watching for the phone leaving that
 * spot. Returns the position used, or null when there is no permission or fix.
 */
export async function armGeofence(
  session: ParkingSession,
): Promise<{ latitude: number; longitude: number } | null> {
  if (!(await hasGeofencePermission())) return null;
  const position = await currentPosition();
  if (!position) return null;
  const { latitude, longitude } = position.coords;
  await Location.startGeofencingAsync(GEOFENCE_TASK, [
    {
      identifier: session.id,
      latitude,
      longitude,
      radius: GEOFENCE_RADIUS_METERS,
      notifyOnEnter: false,
      notifyOnExit: true,
    },
  ]);
  return { latitude, longitude };
}

export async function disarmGeofence(): Promise<void> {
  if (await Location.hasStartedGeofencingAsync(GEOFENCE_TASK)) {
    await Location.stopGeofencingAsync(GEOFENCE_TASK);
  }
}

export function isGeofenceArmed(): Promise<boolean> {
  return Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
}

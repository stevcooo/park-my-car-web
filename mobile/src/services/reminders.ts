import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';
import { isPrepaid, type Provider } from '../data/providers';
import type { ParkingSession } from '../storage/session';

export const STOP_CATEGORY = 'parkingstop';
export const STOP_ACTION = 'stop';
export const CHANNEL = 'parking';
const PREPAID_WARNING_MINUTES = 10;
/** How often a start/stop session nags until it is stopped. */
const STOP_NAG_SECONDS = 60 * 60;

export async function setupNotifications(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Паркинг',
      importance: AndroidImportance.MAX,
    });
  }

  await Notifications.setNotificationCategoryAsync(STOP_CATEGORY, [
    {
      identifier: STOP_ACTION,
      buttonTitle: 'Стопирај паркинг',
      options: { opensAppToForeground: true },
    },
  ]);
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function dateTrigger(date: number): Notifications.NotificationTriggerInput {
  return {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date,
    channelId: CHANNEL,
  };
}

/**
 * Prepaid providers get a warning shortly before the paid time runs out and
 * one more when it has. Start/stop providers get a repeating reminder with a
 * "stop" action until the session is ended.
 */
export async function scheduleReminders(
  session: ParkingSession,
  provider: Provider,
): Promise<string[]> {
  const ids: string[] = [];
  const where = `${session.zoneCode} · ${session.vehicle.plate}`;

  if (isPrepaid(provider) && session.endsAt) {
    const warnAt = session.endsAt - PREPAID_WARNING_MINUTES * 60 * 1000;
    if (warnAt > Date.now()) {
      ids.push(
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Паркингот истекува за ${PREPAID_WARNING_MINUTES} мин`,
            body: where,
          },
          trigger: dateTrigger(warnAt),
        }),
      );
    }
    ids.push(
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Платениот паркинг истече', body: where },
        trigger: dateTrigger(session.endsAt),
      }),
    );
    return ids;
  }

  ids.push(
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Сè уште паркирано?',
        body: `${where}. Испрати „${provider.stopCommand ?? 's'}“ кога ќе заминеш.`,
        categoryIdentifier: STOP_CATEGORY,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: STOP_NAG_SECONDS,
        repeats: true,
        channelId: CHANNEL,
      },
    }),
  );
  return ids;
}

/** Why the app thinks the user is leaving the parking spot. */
export type LeaveReason = 'bluetooth' | 'geofence';

/** Title and body of the "you are probably leaving" reminder. */
export function leaveReminderContent(
  session: ParkingSession,
  provider: Provider,
  reason: LeaveReason,
): { title: string; body: string } {
  const where = `${session.zoneCode} · ${session.vehicle.plate}`;
  const stop = `Испрати „${provider.stopCommand ?? 's'}“ на ${provider.number}.`;
  return reason === 'bluetooth'
    ? { title: 'Поврзано со автомобилот. Стоп на паркингот?', body: `${where}. ${stop}` }
    : { title: 'Се оддалечи од паркингот. Стоп?', body: `${where}. ${stop}` };
}

/**
 * Posts the stop reminder right now, with the same stop action as the hourly
 * nag. Used by the geofence task; the Android Bluetooth receiver builds the
 * same notification natively.
 */
export async function presentLeaveReminder(
  session: ParkingSession,
  provider: Provider,
  reason: LeaveReason,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { ...leaveReminderContent(session, provider, reason), categoryIdentifier: STOP_CATEGORY },
    trigger: Platform.OS === 'android' ? { channelId: CHANNEL } : null,
  });
}

export async function cancelReminders(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

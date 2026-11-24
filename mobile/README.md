# Park My Car (mobile)

Expo + React Native port of the web app in the parent folder. Same two Skopje
providers, same wizard, plus an active-session screen and local reminders.

## What it does

1. Pick a vehicle (stored on device, two seeded), or add one by name and plate.
2. Pick a provider: POC (141414, prepaid 1 to 4 hours) or Gradski Parking
   (144144, start/stop billing).
3. Pick a zone (Gradski zones are grouped A to D), and a duration for POC.
4. **SMS** opens the system compose sheet pre-filled with `<zone> <plate> [hours]`.
   Nothing is sent without you tapping Send. iOS reports back whether you sent
   or cancelled. Android cannot, so the app asks.
5. The session is saved and reminders are scheduled:
   - POC: a notification 10 minutes before the paid time ends and one when it ends.
   - Gradski: an hourly "still parked?" notification with a **Stop parking**
     action. Tapping it opens the app and the compose sheet with the stop command.
6. The active-session screen shows elapsed or remaining time and has **Stop**
   (compose the stop SMS) or **End without SMS**.
7. For Gradski sessions, two optional **leaving detection** triggers post the
   same stop reminder the moment you probably left the spot (see below). The
   active-session screen shows which ones are armed.

## Leaving detection (Gradski only)

Both triggers post the "stop?" notification with the **Stop parking** action,
so the flow after the tap is the same as the hourly nag. Configure them under
**Поставки** (top-right link on the vehicle and active-session screens).

### Android: car Bluetooth connects

`modules/car-bluetooth/` is a local Expo module with a manifest-declared
`BroadcastReceiver` for `android.bluetooth.device.action.ACL_CONNECTED`. That
broadcast is on Android's implicit-broadcast exemption list, so the receiver
runs even when the app process is dead. When the connecting device is the one
picked as "the car" and a session is armed, the receiver builds the
notification through expo-notifications' own `NotificationsService`, so it
lands in the `parking` channel with the `parkingstop` category and the tap
reaches the JS response listener like any other reminder.

- Pick the car in Settings. Listing paired devices asks for `BLUETOOTH_CONNECT`
  on Android 12+; the receiver needs that grant too, so pick the car once
  before relying on it.
- The JS side mirrors the armed state into SharedPreferences (`arm` /
  `disarm` in `src/services/carBluetooth.ts`) when a session starts or ends.
  The receiver never touches AsyncStorage.
- A 2-minute debounce stops the several profile connections (A2DP, HFP...)
  from posting several reminders.

### Both platforms: geofence

`src/services/geofence.ts` defines an `expo-task-manager` task at module
scope. Arming records the current position (high accuracy, 15 s timeout, last
known fix as fallback) and registers one exit geofence with a 150 m radius.
On exit it posts the reminder once and stops watching; the hourly nag keeps
going if that is ignored.

- Needs background location ("Always" on iOS, "Allow all the time" on
  Android). The toggle requests foreground then background permission and
  explains where to change it when only foreground was granted. Nothing is
  requested until the toggle is turned on.
- It can false-fire if you walk 150 m away from the car, which the UI says.
- Android does not restart a force-stopped app for geofence events; iOS does.

### iOS: zero-code alternative with Shortcuts

iOS does not let apps see which Bluetooth device connected, so the Bluetooth
trigger is Android-only. The Shortcuts app can do it without this app:

1. Shortcuts > **Automation** > **+** > **Bluetooth** (or **CarPlay**).
2. Pick the car's device, choose **Is Connected**, and **Run Immediately**.
3. Action: **Send Message**, text `s`, recipient `144144`.

That sends the stop SMS whenever the car connects, parked or not. Gradski
ignores a stop with no active session, so the cost is one wasted SMS per
drive. A less blunt variant: action **Show Notification** instead, and stop
from the app.

## Assumptions to confirm

- Gradski's stop command is `s` sent to 144144 (`stopCommand` in
  `src/data/providers.ts`). POC is treated as prepaid with no stop message.
- The nag interval for start/stop sessions is 60 minutes (`STOP_NAG_SECONDS`
  in `src/services/reminders.ts`).

## Running

Notifications and SMS are native modules, so Expo Go will not work. Use a
development build:

```bash
npx expo run:ios
```

```bash
npx expo run:android
```

Other commands: `npm run typecheck`, `npx expo lint`, `npx expo-doctor`.

The iOS simulator has no SMS, so the compose step reports "unavailable" there.
Test the SMS flow on a real device. Geofencing can be tested in the simulator
with Features > Location > Custom Location.

The Kotlin in `modules/car-bluetooth/` has not been compiled yet: the machine
it was written on had no Android SDK. The first `npx expo run:android` is the
real check.

## Layout

```
App.tsx                      wizard state machine, session start/stop
src/data/providers.ts        providers, zones, durations, SMS text
src/storage/vehicles.ts      vehicle list (AsyncStorage)
src/storage/session.ts       the active parking session (AsyncStorage)
src/services/sms.ts          compose sheet with sms: deep-link fallback
src/services/reminders.ts    notification channel, category, scheduling
src/services/geofence.ts     exit geofence task, background permission flow
src/services/carBluetooth.ts JS side of the Android Bluetooth trigger
src/services/leaveTriggers.ts arm/disarm both triggers, status for the UI
src/storage/settings.ts      car device and geofence toggle (AsyncStorage)
src/components/              OptionGrid, Screen (footer buttons), SelectionBar
src/screens/                 one file per wizard step, ActiveSessionScreen, SettingsScreen
modules/car-bluetooth/       local Expo module: ACL_CONNECTED receiver (Android)
```

## Not done yet (later tiers)

- Compile and try the Android Bluetooth receiver on a real phone (no Android
  SDK on the authoring machine); confirm the stop action tap reaches JS when
  the app was not running.
- Try the geofence on a real walk-away; tune the 150 m radius.
- CarPlay (needs Apple's parking entitlement) and Android Auto via
  `react-native-carplay`.
- Editing a vehicle in place (today: remove and re-add).
- Signing, TestFlight and sideload builds (EAS or local).

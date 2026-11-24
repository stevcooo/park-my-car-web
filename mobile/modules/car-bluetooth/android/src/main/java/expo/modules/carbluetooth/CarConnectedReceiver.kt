package expo.modules.carbluetooth

import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import expo.modules.notifications.notifications.enums.NotificationPriority
import expo.modules.notifications.notifications.model.Notification
import expo.modules.notifications.notifications.model.NotificationContent
import expo.modules.notifications.notifications.model.NotificationRequest
import expo.modules.notifications.notifications.triggers.ChannelAwareTrigger
import expo.modules.notifications.service.NotificationsService

/**
 * Fires when the phone opens a Bluetooth link to any device. If the device is
 * the one the user picked as "the car" and a session is armed, it posts the
 * stop reminder through expo-notifications, so the notification carries the
 * app's stop category (with its action button) and a tap reaches the JS
 * response listener like any other reminder.
 */
class CarConnectedReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != BluetoothDevice.ACTION_ACL_CONNECTED) return

    val device: BluetoothDevice? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE, BluetoothDevice::class.java)
    } else {
      @Suppress("DEPRECATION")
      intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
    }
    // getAddress() needs no permission, unlike getName().
    val address = device?.address ?: return

    val store = TriggerStore(context)
    val armed = store.read() ?: return
    if (!armed.address.equals(address, ignoreCase = true)) return

    // Several profiles (A2DP, HFP, ...) connect one after another, each with
    // its own ACL_CONNECTED. One reminder per approach is enough.
    val now = System.currentTimeMillis()
    if (now - armed.lastFiredAt < DEBOUNCE_MS) return
    store.markFired(now)

    val content = NotificationContent.Builder()
      .setTitle(armed.title)
      .setText(armed.body)
      .setCategoryId(armed.categoryId)
      .setPriority(NotificationPriority.MAX)
      .setAutoDismiss(true)
      .build()
    val request = NotificationRequest(
      "car-bluetooth-$now",
      content,
      ChannelAwareTrigger(armed.channelId.ifEmpty { null }),
    )
    Log.i(TAG, "Car connected, posting the stop reminder")
    NotificationsService.present(context, Notification(request))
  }

  private companion object {
    const val TAG = "CarBluetooth"
    const val DEBOUNCE_MS = 2 * 60 * 1000L
  }
}

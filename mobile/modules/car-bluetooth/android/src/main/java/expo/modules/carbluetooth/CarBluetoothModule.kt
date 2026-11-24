package expo.modules.carbluetooth

import android.annotation.SuppressLint
import android.bluetooth.BluetoothManager
import android.content.Context
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ArmOptions : Record {
  @Field val address: String = ""
  @Field val title: String = ""
  @Field val body: String = ""
  @Field val channelId: String = ""
  @Field val categoryId: String = ""
}

class BluetoothUnavailableException :
  CodedException("ERR_BLUETOOTH_UNAVAILABLE", "This device has no Bluetooth adapter", null)

class BluetoothPermissionException :
  CodedException("ERR_BLUETOOTH_PERMISSION", "BLUETOOTH_CONNECT was not granted", null)

class CarBluetoothModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw CodedException("ERR_NO_CONTEXT", "React context is gone", null)

  override fun definition() = ModuleDefinition {
    Name("CarBluetooth")

    /**
     * Paired (bonded) devices as `{ name, address }`. Needs the runtime
     * BLUETOOTH_CONNECT permission on Android 12+, which JS requests first.
     */
    AsyncFunction("getBondedDevices") {
      val manager = context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
      val adapter = manager?.adapter ?: throw BluetoothUnavailableException()
      try {
        @SuppressLint("MissingPermission")
        val devices = adapter.bondedDevices.map { device ->
          mapOf(
            "name" to (device.name ?: device.address),
            "address" to device.address,
          )
        }
        devices.sortedBy { it["name"] }
      } catch (e: SecurityException) {
        throw BluetoothPermissionException()
      }
    }

    /** Remembers the car and the reminder text until `disarm` is called. */
    Function("arm") { options: ArmOptions ->
      TriggerStore(context).write(
        ArmedTrigger(
          address = options.address,
          title = options.title,
          body = options.body,
          channelId = options.channelId,
          categoryId = options.categoryId,
          lastFiredAt = 0L,
        ),
      )
    }

    Function("disarm") {
      TriggerStore(context).clear()
    }

    /** The address the receiver is currently watching for, or null. */
    Function("armedAddress") {
      TriggerStore(context).read()?.address
    }
  }
}

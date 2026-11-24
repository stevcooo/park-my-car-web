package expo.modules.carbluetooth

import android.content.Context

/**
 * What the JS side armed, kept in SharedPreferences so the broadcast receiver
 * can read it without the React runtime. Cleared when the session ends.
 */
data class ArmedTrigger(
  val address: String,
  val title: String,
  val body: String,
  val channelId: String,
  val categoryId: String,
  val lastFiredAt: Long,
)

class TriggerStore(context: Context) {
  private val prefs = context.applicationContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  fun read(): ArmedTrigger? {
    val address = prefs.getString(KEY_ADDRESS, null) ?: return null
    return ArmedTrigger(
      address = address,
      title = prefs.getString(KEY_TITLE, "") ?: "",
      body = prefs.getString(KEY_BODY, "") ?: "",
      channelId = prefs.getString(KEY_CHANNEL, "") ?: "",
      categoryId = prefs.getString(KEY_CATEGORY, "") ?: "",
      lastFiredAt = prefs.getLong(KEY_LAST_FIRED, 0L),
    )
  }

  fun write(trigger: ArmedTrigger) {
    prefs.edit()
      .putString(KEY_ADDRESS, trigger.address)
      .putString(KEY_TITLE, trigger.title)
      .putString(KEY_BODY, trigger.body)
      .putString(KEY_CHANNEL, trigger.channelId)
      .putString(KEY_CATEGORY, trigger.categoryId)
      .putLong(KEY_LAST_FIRED, trigger.lastFiredAt)
      .apply()
  }

  fun markFired(at: Long) {
    prefs.edit().putLong(KEY_LAST_FIRED, at).apply()
  }

  fun clear() {
    prefs.edit().clear().apply()
  }

  private companion object {
    const val PREFS = "expo.modules.carbluetooth.trigger"
    const val KEY_ADDRESS = "address"
    const val KEY_TITLE = "title"
    const val KEY_BODY = "body"
    const val KEY_CHANNEL = "channelId"
    const val KEY_CATEGORY = "categoryId"
    const val KEY_LAST_FIRED = "lastFiredAt"
  }
}

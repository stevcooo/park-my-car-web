import * as SMS from 'expo-sms';
import { Linking, Platform } from 'react-native';

/**
 * 'sent' and 'cancelled' are only reported by iOS. Android always returns
 * 'unknown' because the OS gives no feedback from the messaging app, so the
 * caller has to ask the user whether the message went out.
 */
export type SmsOutcome = 'sent' | 'cancelled' | 'unknown' | 'unavailable';

/** Opens the system compose sheet with the recipient and text pre-filled. */
export async function composeSms(number: string, body: string): Promise<SmsOutcome> {
  if (await SMS.isAvailableAsync()) {
    const { result } = await SMS.sendSMSAsync(number, body);
    return result;
  }

  // Fallback (e.g. a device without the MessageUI framework): the same deep
  // link the web app used. The two platforms disagree on the query syntax.
  const encoded = encodeURIComponent(body);
  const url =
    Platform.OS === 'ios' ? `sms:${number}&body=${encoded}` : `sms:${number}?body=${encoded}`;
  if (await Linking.canOpenURL(url)) {
    await Linking.openURL(url);
    return 'unknown';
  }
  return 'unavailable';
}

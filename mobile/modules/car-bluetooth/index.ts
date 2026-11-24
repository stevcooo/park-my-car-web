import { type NativeModule, requireOptionalNativeModule } from 'expo';

export type BondedDevice = { name: string; address: string };

export type ArmOptions = {
  /** MAC address of the paired device that is "the car". */
  address: string;
  title: string;
  body: string;
  /** expo-notifications channel id (Android). */
  channelId: string;
  /** expo-notifications category id, so the notification gets the stop action. */
  categoryId: string;
};

declare class CarBluetoothModule extends NativeModule {
  getBondedDevices(): Promise<BondedDevice[]>;
  arm(options: ArmOptions): void;
  disarm(): void;
  armedAddress(): string | null;
}

/** Android only. Null on iOS, which does not expose car Bluetooth to apps. */
export const CarBluetooth = requireOptionalNativeModule<CarBluetoothModule>('CarBluetooth');

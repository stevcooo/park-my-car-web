import type { ImageSourcePropType } from 'react-native';

export type Zone = { code: string; name?: string };
export type ZoneGroup = { name: string; children: Zone[] };
export type ZoneItem = Zone | ZoneGroup;

export type Duration = { code: string; name: string; hours: number };

export type ProviderId = 'poc' | 'gradski';

export type Provider = {
  id: ProviderId;
  name: string;
  /** Short number the SMS goes to. */
  number: string;
  logo: ImageSourcePropType;
  zones: ZoneItem[];
  /** Empty means the provider bills start/stop instead of prepaid hours. */
  durations: Duration[];
  /** SMS text that ends an active session, for start/stop providers. */
  stopCommand?: string;
};

export function isZoneGroup(item: ZoneItem): item is ZoneGroup {
  return 'children' in item;
}

export function zoneLabel(zone: Zone): string {
  return zone.name ?? zone.code;
}

export const providers: Provider[] = [
  {
    id: 'poc',
    name: 'Паркинзи на општина Центар',
    number: '141414',
    logo: require('../../assets/providers/poc.png'),
    zones: [
      { name: 'Зона 01', code: '01' },
      { name: 'Зона 0', code: '0' },
      { name: 'Зона 1', code: '1' },
      { name: 'Зона 2', code: '2' },
    ],
    durations: [
      { name: '1 час', code: '1', hours: 1 },
      { name: '2 часа', code: '2', hours: 2 },
      { name: '3 часа', code: '3', hours: 3 },
      { name: '4 часа', code: '4', hours: 4 },
    ],
  },
  {
    id: 'gradski',
    name: 'Паркинзи на Град Скопје',
    number: '144144',
    logo: require('../../assets/providers/gradski.jpeg'),
    zones: [
      {
        name: 'A',
        children: ['A0', 'A01', 'A05', 'A06', 'A3', 'A4', 'A8'].map((code) => ({ code })),
      },
      {
        name: 'B',
        children: ['B2', 'B3', 'B6', 'B7', 'B10'].map((code) => ({ code })),
      },
      {
        name: 'C',
        children: ['C8', 'C9', 'C15', 'C17', 'C19', 'C33', 'C35', 'C45', 'C46', 'C80', 'C81'].map(
          (code) => ({ code }),
        ),
      },
      {
        name: 'D',
        children: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D40', 'D42', 'D63'].map(
          (code) => ({ code }),
        ),
      },
    ],
    durations: [],
    // TODO: confirm the exact stop text the provider expects.
    stopCommand: 's',
  },
];

export function providerById(id: ProviderId): Provider {
  const found = providers.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown provider ${id}`);
  return found;
}

export function isPrepaid(provider: Provider): boolean {
  return provider.durations.length > 0;
}

/** Text of the SMS that starts parking, identical to what the web app sent. */
export function startSmsText(zoneCode: string, plate: string, duration?: Duration): string {
  return [zoneCode, plate, duration?.code].filter(Boolean).join(' ');
}

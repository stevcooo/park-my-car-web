import AsyncStorage from '@react-native-async-storage/async-storage';

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
};

const KEY = 'vehicles';

// Seeded on first launch, same as the web app. Edit or remove them in the app.
const defaultVehicles: Vehicle[] = [
  { id: 'seed-1', name: 'Мазда', plate: 'SK9819BM' },
  { id: 'seed-2', name: 'Tojota', plate: 'SK187VF' },
];

async function write(vehicles: Vehicle[]): Promise<Vehicle[]> {
  await AsyncStorage.setItem(KEY, JSON.stringify(vehicles));
  return vehicles;
}

export async function getVehicles(): Promise<Vehicle[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw === null) return write(defaultVehicles);
  try {
    return JSON.parse(raw) as Vehicle[];
  } catch {
    return write(defaultVehicles);
  }
}

/** Plates are sent inside an SMS, so keep them upper-case with no spaces. */
export function normalizePlate(plate: string): string {
  return plate.replace(/\s+/g, '').toUpperCase();
}

export async function addVehicle(input: { name: string; plate: string }): Promise<Vehicle[]> {
  const vehicles = await getVehicles();
  const vehicle: Vehicle = {
    id: `${Date.now()}`,
    name: input.name.trim(),
    plate: normalizePlate(input.plate),
  };
  return write([...vehicles, vehicle]);
}

export async function removeVehicle(id: string): Promise<Vehicle[]> {
  const vehicles = await getVehicles();
  return write(vehicles.filter((v) => v.id !== id));
}

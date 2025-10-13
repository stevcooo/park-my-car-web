/* eslint-disable comma-dangle */
// Vehicle management service for localStorage operations

const VEHICLES_KEY = 'vehicles';

const vehicleService = {
  // Get all vehicles from localStorage
  getVehicles: () => {
    try {
      const vehicles = localStorage.getItem(VEHICLES_KEY);
      return vehicles ? JSON.parse(vehicles) : [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading vehicles from localStorage:', error);
      return [];
    }
  },

  // Save vehicles to localStorage
  saveVehicles: (vehicles) => {
    try {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving vehicles to localStorage:', error);
      return false;
    }
  },

  // Add a new vehicle
  addVehicle: (vehicle) => {
    const vehicles = vehicleService.getVehicles();
    const newVehicle = {
      id: Date.now(), // Simple unique ID generation
      name: vehicle.name.trim(),
      plate: vehicle.plate.trim()
    };
    const updatedVehicles = [...vehicles, newVehicle];
    vehicleService.saveVehicles(updatedVehicles);
    return newVehicle;
  },

  // Remove a vehicle by ID
  removeVehicle: (vehicleId) => {
    const vehicles = vehicleService.getVehicles();
    const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== vehicleId);
    vehicleService.saveVehicles(updatedVehicles);
    return updatedVehicles;
  },

  // Initialize with default vehicles if none exist
  initializeDefaultVehicles: () => {
    const vehicles = vehicleService.getVehicles();
    if (vehicles.length === 0) {
      const defaultVehicles = [
        {
          id: 1,
          name: 'Мазда',
          plate: 'SK9819BM'
        },
        {
          id: 2,
          name: 'Tojota',
          plate: 'SK187VF'
        }
      ];
      vehicleService.saveVehicles(defaultVehicles);
      return defaultVehicles;
    }
    return vehicles;
  }
};

export default vehicleService;

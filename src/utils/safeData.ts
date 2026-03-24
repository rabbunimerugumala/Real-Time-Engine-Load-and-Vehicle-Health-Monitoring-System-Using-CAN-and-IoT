import type { VehicleData } from '../types/vehicle';

/**
 * Returns a "safe" version of the vehicle data when the device is offline.
 * Numeric sensors are zeroed out, and boolean-like values are set to 0 (closed/no fix).
 */
export function getSafeData(data: VehicleData | null, isOnline: boolean): VehicleData | null {
  if (!data) return null;
  if (isOnline) return data;

  return {
    ...data,
    online: false,
    sensors: {
      temperature: 0,
      load: 0,
      fuel: 0,
      gas: 0,
      humidity: 0,
      tilt: 0,
      door: 0, // closed
    },
    gps: {
      fix: false,
      satellites: 0,
      lat: 0,
      lng: 0,
    },
  };
}

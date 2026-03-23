export interface SensorData {
  temperature: number;
  load: number;
  tilt: number;
  gforce: number;
  fuel: number;
  door: number; // 0 = closed, 1 = open
}

export interface LocationData {
  lat: number;
  lng: number;
}

export interface VehicleData {
  id?: string;
  online: boolean;
  timestamp: number;
  sensors: SensorData;
  location: LocationData;
}

export interface HistoryPoint {
  time: string;
  temperature: number;
  load: number;
}

export type AlertType = 'door' | 'overload' | 'temperature';

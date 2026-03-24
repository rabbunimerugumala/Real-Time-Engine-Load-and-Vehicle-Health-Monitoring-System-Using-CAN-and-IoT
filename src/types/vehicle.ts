export interface SensorData {
  temperature: number;
  load: number;
  fuel: number;
  gas: number;
  humidity: number;
  tilt: number;
  door: number; // 0 = closed, 1 = open
}

export interface GPSData {
  fix: boolean;
  satellites: number;
  lat: number;
  lng: number;
}

export interface VehicleData {
  timestamp: number;
  online: boolean;
  sensors: SensorData;
  gps: GPSData;
}

export interface HistoryPoint {
  time: string;
  temperature: number;
  load: number;
}

export type AlertType = 'door' | 'overload' | 'temperature';


export interface Contact {
  id: string;
  name: string;
  phone: string;
  isEmergency: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  bloodGroup: string;
  medicalConditions: string;
  emergencyNote: string;
}

export interface LocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  timestamp: number | null;
}

export interface SensorData {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

export enum SafetyStatus {
  SECURE = 'SECURE',
  MONITORING = 'MONITORING',
  DISTRESS = 'DISTRESS',
  SOS_TRIGGERED = 'SOS_TRIGGERED'
}

export interface AlertLog {
  id: string;
  type: 'FALL' | 'VOICE' | 'MANUAL' | 'SHAKE';
  timestamp: number;
  location: LocationState;
  status: 'SENT' | 'FAILED';
  details?: string;
}

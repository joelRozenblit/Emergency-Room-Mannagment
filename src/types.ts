export type SymptomsCode = 1 | 2 | 3 | 4 | 5;

export type Urgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// TODO: | "DISCHARGED" for patients history
export type Status = "IN_LINE" | "IN_ROOM";

export type EmergencyRoom = {
  id: string;
  currentPatient: Patient | null;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  symptoms: SymptomsCode[];
  arrivalTime: Date;
  urgency: Urgency;
};

export type PatientAssignment = {
  patientId: string;
  status: Status;
  beforeInLine?: number;
  roomId?: string;
};

export type dischargeResult = {
  discharged: boolean;
  nextPatient: PatientAssignment | null;
};

export type RoomStatus = {
  freeRoom: number;
  occupiedRooms: number;
};

export type QueueStatus = {
  high: number;
  medium: number;
  low: number;
};

export type SystemStats = {
  roomStats: RoomStatus;
  queueStats: QueueStatus;
};

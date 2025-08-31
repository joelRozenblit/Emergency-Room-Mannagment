import type {
  dischargeResult,
  Patient,
  PatientAssignment,
  SymptomsCode,
  SystemStats,
  Urgency,
} from "../types";
import { PatientsManager } from "./PatientsManager";
import type { RoomsManager } from "./RoomsManager";

export class ERManager {
  private patientsManager: PatientsManager = new PatientsManager();

  constructor(private roomsManager: RoomsManager) {
    this.roomsManager = roomsManager;
  }

  // admit new patient
  async admitPatient(patient: Patient): Promise<PatientAssignment | null> {
    // update urgency
    const urgency = this.calculateUrgency(patient.symptoms);
    patient.urgency = urgency;

    if (urgency === "CRITICAL") this.alertStaff(patient);

    // first - add to queue
    const queued = await this.patientsManager.pushPatient(patient);
    if (!queued) return null; // TODO: send error

    // try to assign room - case queues was empty
    const nextPatient = await this.nextPatient();
    if (!nextPatient) return null; // TODO: send error

    return nextPatient;
  }

  //
  async discharge(patientId: string): Promise<dischargeResult> {
    const success = await this.roomsManager.discharge(patientId);
    if (!success) {
      return { discharged: false, nextPatient: null };
    }
    // room freed - try admit new patient
    const nextPatient = await this.nextPatient();
    if (!nextPatient) return { discharged: false, nextPatient: null };
    else return { discharged: true, nextPatient: nextPatient };
  }

  async getStats(): Promise<SystemStats> {
    const roomStats = await this.roomsManager.getStats();
    const queueStats = await this.patientsManager.getStats();
    return { roomStats, queueStats };
  }

  //
  private async nextPatient(): Promise<PatientAssignment | null> {
    const nextPatient = await this.patientsManager.pullPatient();
    // case no patients in line
    if (!nextPatient) return null;

    // admit next patient
    const assign = await this.roomsManager.admit(nextPatient);
    if (assign) return { patientId: nextPatient.id, status: "IN_ROOM" };
    else return { patientId: nextPatient.id, status: "IN_LINE" };
  }

  private calculateUrgency(symptoms: SymptomsCode[]): Urgency {
    const max = Math.max(...symptoms);
    switch (max) {
      case 1 | 2:
        return "LOW";
      case 3:
        return "MEDIUM";
      case 4:
        return "HIGH";
      case 5:
        return "CRITICAL";
      default:
        // TODO: return null
        return "LOW";
    }
  }

  private alertStaff(patient: Patient) {
    // TODO ...
    console.log(`Critical Patient Arrived! patient id:${patient.id}`);
  }
}

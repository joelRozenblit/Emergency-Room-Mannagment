import { Queue } from "../../node_modules/queue-typescript/lib/src/index";
import type { Patient, QueueStatus } from "../types";

export class PatientsManager {
  private regularQ: Queue<Patient>;
  private urgencyQ: Queue<Patient>;

  constructor() {
    this.regularQ = new Queue();
    this.urgencyQ = new Queue();
  }

  // async/try to simulate DB update
  async pushPatient(patient: Patient): Promise<boolean> {
    try {
      if (patient.urgency === "LOW" || patient.urgency === "MEDIUM") {
        await this.regularQ.enqueue(patient);
      } else {
        await this.urgencyQ.enqueue(patient);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  // TODO: validate return statement
  async pullPatient(): Promise<Patient | null> {
    // await
    return this.urgencyQ.dequeue() || this.regularQ.dequeue();
  }

  async getStats(): Promise<QueueStatus> {
    // TODO: calculate
    return { high: 0, medium: 0, low: 0 };
  }
}

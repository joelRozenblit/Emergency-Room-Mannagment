import type { EmergencyRoom, Patient, RoomStatus } from "../types";

export class RoomsManager {
  private rooms: EmergencyRoom[];

  constructor(rooms: EmergencyRoom[]) {
    this.rooms = rooms;
  }

  async admit(patient: Patient): Promise<boolean> {
    // await - try catch
    for (const room of this.rooms) {
      if (room.currentPatient === null) {
        room.currentPatient = patient;
        return true;
      }
    }
    return false;
  }

  async discharge(patientId: string): Promise<boolean> {
    //await - try catch
    for (const room of this.rooms) {
      if (room.currentPatient && room.currentPatient.id === patientId) {
        room.currentPatient = null;
        return true;
      }
    }
    return false;
  }

  async getStats(): Promise<RoomStatus> {
    let occupiedRooms = 0;
    for (const r of this.rooms) {
      if (r.currentPatient) occupiedRooms++;
    }
    return {
      freeRoom: this.rooms.length - occupiedRooms,
      occupiedRooms: occupiedRooms,
    };
  }
}

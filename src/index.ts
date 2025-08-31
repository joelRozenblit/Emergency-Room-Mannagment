import { ERManager } from "./models/ERManager";
import { RoomsManager } from "./models/RoomsManager";
import type { EmergencyRoom } from "./types";

const rooms: EmergencyRoom[] = [
  { id: "1", currentPatient: null },
  { id: "2", currentPatient: null },
];
const erManager = new ERManager(new RoomsManager(rooms));

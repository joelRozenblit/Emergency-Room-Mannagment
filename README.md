# Emergency Room Management System - HLD

## scope:

managing patients, managing rooms. by occupancy and urgency

## out:

users management, authorization/authentication,

## Actors & Context:

client => ER
ER => Rooms Manager
ER => Patients Manager
ER => client

## Data Model

type SymptomCode = 1|2|3|4|5;

type Urgency = "LOW"|"MEDIUM"|"HIGH"|"CRITICAL";

type Status = "IN-LINE" | "IN-ROOM" | "DISCHARGED";

type Patient = {
id: string,
name: string,
age: number,
symptoms: SymptomCode,
arrivalTime: Date,
urgency: Urgency
};

Type EmergencyRoom = {
id: string,
currentPatient: Patient | null
};

type PatientAssignment = {
patientId: string
status: Status
beforeInLine?: number
roomId?: string
}

## Interfaces / Contracts:

base url: /er.manager
POST patient /patients
PUT patient /patient/:id

request {
id: string,
name: string,
age: number,
symptoms: SymptomCode,
arrivalTime: Date,
urgency: Urgency
}

success response {
patientId: string
status: Status
beforeInLine?: number
roomId?: string
}

### contract:

admitPatient(patient: Patient): PatientAssignment
dischargePatient(patientId: string): boolean
getRoomStatus(): {freeRooms: number, occupiedRooms: number}
getQueueStatus() : {high: number, medium: number, low: number}

## Critical Flows

### happy path 1 (new patient):

client post request
=> ER validate fields
=> ER create urgency - if critical alert staff
=> ER check for available room
=> 1. if available update room with patient id
=> response details
=> 2. if not available add patient to appropriate queue
(LOW | MEDIUM = regularQ, HIGH | CRITICAL: urgencyQ)
=> response details

### happy path 2 (patient leave):

client put request()
=> ER search for patientId in rooms
=> if found update room
=> response details.
=> ER check urgency queue
=> if not empty pull patient to the free room
=> if empty check regular queue
=> if not empty pull patient to the free room

### failure path 3 (patient not found):

client put request(patient discharge)
=> ER search for patientId in rooms
=> => if not found response error (not-found)

## Test/Validation

admit patient (assign to free room)
admit critical patient (room full, add to urgency queue)
discharge patient
discharge unexciting patient (error response)

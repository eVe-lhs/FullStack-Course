/* eslint-disable @typescript-eslint/no-empty-interface */
export interface diagnoseEntry {
  code: string;
  name: string;
  latin?: string;
}
export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<diagnoseEntry["code"]>;
}

export interface discharge {
  date: string;
  criteria: string;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: discharge;
}

export interface sickLeave {
  startDate: string;
  endDate: string;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: sickLeave;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface patientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}
export type NewEntry =
  | Omit<HospitalEntry, "id">
  | Omit<HealthCheckEntry, "id">
  | Omit<OccupationalHealthcareEntry, "id">;
export type NewBaseEntry = Omit<BaseEntry, "id">;
export type NonSensitivePatientEntry = Omit<patientEntry, "ssn">;
export type NewPatientEntry = Omit<patientEntry, "id">;
export type PublicPatient = Omit<patientEntry, "ssn" | "entries">;

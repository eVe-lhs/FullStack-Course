import patientData from "../data/patients";
import {
  patientEntry,
  NonSensitivePatientEntry,
  NewPatientEntry,
  Entry,
  NewEntry,
} from "../types";
import { v4 as uuid } from "uuid";
const patients: Array<patientEntry> = patientData;
const getEntries = (): Array<patientEntry> => {
  return patients;
};
const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(
    ({ id, dateOfBirth, gender, name, occupation, entries }) => ({
      id,
      name,
      occupation,
      gender,
      dateOfBirth,
      entries,
    })
  );
};
const getOneEntry = (id: string): patientEntry | undefined => {
  return patients.find((patient) => patient.id === id);
};
const addPatient = (object: NewPatientEntry): patientEntry => {
  const id: string = uuid();
  const newEntry = {
    id,
    ...object,
  };
  patients.push(newEntry);
  return newEntry;
};
const addEntry = (idPatient: string, object: NewEntry): Entry => {
  const id: string = uuid();
  const newEntry = {
    id,
    ...object,
  };
  const patient = patients.find((patient) => patient.id === idPatient);
  if (!patient) {
    throw new Error("Invalid patient id");
  }
  patient.entries.push(newEntry);
  return newEntry;
};
export default {
  getEntries,
  addPatient,
  getNonSensitiveEntries,
  getOneEntry,
  addEntry,
};

import { State } from "./state";
import { Patient, Diagnosis, Entry } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "GET_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      payload: Entry;
      id: string;
    };

export const setPatientList = (patient: Patient[]): Action => ({
  type: "SET_PATIENT_LIST",
  payload: patient,
});
export const addPatient = (patient: Patient): Action => ({
  type: "ADD_PATIENT",
  payload: patient,
});
export const getPatient = (patient: Patient): Action => ({
  type: "GET_PATIENT",
  payload: patient,
});
export const setDiagnosisList = (diagnosis: Diagnosis[]): Action => ({
  type: "SET_DIAGNOSIS_LIST",
  payload: diagnosis,
});
export const addEntry = (entry: Entry, id: string): Action => ({
  type: "ADD_ENTRY",
  payload: entry,
  id: id,
});
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "ADD_ENTRY":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.id]: {
            ...state.patients[action.id],
            entries: [...state.patients[action.id].entries, action.payload],
          },
        },
        patient: {
          ...state.patient,
          entries: [...state.patient?.entries, action.payload],
        },
      };
    case "GET_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
        },
        patient: action.payload,
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnosis: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnosis,
        },
      };
    default:
      return state;
  }
};

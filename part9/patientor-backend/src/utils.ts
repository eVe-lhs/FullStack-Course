/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  NewPatientEntry,
  Gender,
  diagnoseEntry,
  NewBaseEntry,
  HealthCheckRating,
  NewEntry,
  sickLeave,
} from "./types";
import diagnosesData from "./data/diagnoses.json";
const diagnoses: Array<diagnoseEntry> = diagnosesData;
const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};
// const isNumber = (text: any): text is number => {
//   return typeof text === "number" || text instanceof Number;
// };
const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name: " + name);
  }
  return name;
};
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};
const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};
const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};
const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation: " + occupation);
  }
  return occupation;
};
const parseSSN = (ssn: any): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing ssn" + ssn);
  }
  return ssn;
};

export const toNewPatientEntry = (object: any): NewPatientEntry => {
  const newEntry: NewPatientEntry = {
    name: parseName(object.name),
    gender: parseGender(object.gender),
    dateOfBirth: parseDate(object.dateOfBirth),
    occupation: parseOccupation(object.occupation),
    ssn: parseSSN(object.ssn),
    entries: [],
  };
  return newEntry;
};
const parseDescription = (description: any): string => {
  if (!description || !isString(description)) {
    throw new Error("Incorrect or missing description" + description);
  }
  return description;
};
const parseSpecialist = (specialist: any): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error("Incorrect or missing specialist" + specialist);
  }
  return specialist;
};
const isStringArray = (texts: Array<any>): texts is Array<string> => {
  let isTrue = true;
  texts.map((text: any) =>
    isString(text) ? (isTrue = true) : (isTrue = false)
  );
  return isTrue;
};
const parseDiagnosisCode = (code: Array<any>): Array<string> | undefined => {
  if (code.length != 0) {
    let isDgCode = false;
    code.map((code) =>
      diagnoses.some((diagnose) =>
        diagnose.code === code ? (isDgCode = true) : (isDgCode = false)
      )
    );
    if (!isStringArray(code) || !isDgCode) {
      throw new Error("Incorrect codes detected" + code);
    }
    return code;
  } else {
    return undefined;
  }
};
enum type {
  Hospital = "Hospital",
  OccupationalHealthcare = "OccupationalHealthcare",
  HealthCheck = "HealthCheck",
}
const isType = (param: any): param is type => {
  return Object.values(type).includes(param);
};
const parseType = (type: any): type => {
  if (!type || !isString(type) || !isType(type)) {
    throw new Error("Incorrect or missing type" + type);
  }
  return type;
};
const parseSickLeaveDate = (date: any): string => {
  if (date) {
    if (!isString(date) || !isDate(date)) {
      throw new Error("Incorrect date: " + date);
    }
    return date;
  } else return "no info given";
};
const parseSickLeave = (date1: any, date2: any): sickLeave | undefined => {
  if (!date1 && !date2) {
    return undefined;
  } else {
    return {
      startDate: parseSickLeaveDate(date1),
      endDate: parseSickLeaveDate(date2),
    };
  }
};
const parseCriteria = (criteria: any): string => {
  if (!criteria || !isString(criteria)) {
    throw new Error("Incorrect or missing criteria" + criteria);
  }
  return criteria;
};
const parseEmployerName = (employer: any): string => {
  if (!employer || !isString(employer)) {
    throw new Error("Incorrect or missing employer" + employer);
  }
  return employer;
};
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const parseHealthCheckRating = (rating: any): HealthCheckRating => {
  if (!rating || !isString(rating)) {
    throw new Error("Incorrect or missing rating: " + rating);
  }
  switch (rating) {
    case "Healthy":
      return HealthCheckRating.Healthy;
    case "LowRisk":
      return HealthCheckRating.LowRisk;
    case "HighRisk":
      return HealthCheckRating.HighRisk;
    case "CriticalRisk":
      return HealthCheckRating.CriticalRisk;
    default:
      return assertNever(rating as never);
  }
};

export const toNewEntryOfPatient = (object: any): NewEntry => {
  const baseEntry: NewBaseEntry = {
    description: parseDescription(object.description),
    date: parseDate(object.date),
    specialist: parseSpecialist(object.specialist),
    diagnosisCodes: parseDiagnosisCode(object.diagnosisCodes),
  };
  const type: type = parseType(object.type);
  switch (type) {
    case "Hospital": {
      const finalEntry: NewEntry = {
        ...baseEntry,
        type,
        discharge: {
          date: parseDate(object.discharge.date),
          criteria: parseCriteria(object.discharge.criteria),
        },
      };
      return finalEntry;
    }
    case "OccupationalHealthcare": {
      const finalEntry: NewEntry = {
        ...baseEntry,
        type,
        employerName: parseEmployerName(object.employerName),
        sickLeave: parseSickLeave(
          object.sickLeave.startDate,
          object.sickLeave.endDate
        ),
      };
      return finalEntry;
    }
    case "HealthCheck": {
      const finalEntry: NewEntry = {
        ...baseEntry,
        type,
        healthCheckRating: parseHealthCheckRating(object.HealthCheckRating),
      };
      return finalEntry;
    }
    default:
      return assertNever(object.entry as never);
  }
};

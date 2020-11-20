import diagnosesData from "../data/diagnoses.json";
import { diagnoseEntry } from "../types";

const diagnoses: Array<diagnoseEntry> = diagnosesData;
const getEntries = (): Array<diagnoseEntry> => {
  return diagnoses;
};

const addEntry = (): null => {
  return null;
};

export default {
  getEntries,
  addEntry,
};

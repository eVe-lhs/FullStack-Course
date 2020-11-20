import express from "express";
import patientService from "../services/patients";
import { toNewPatientEntry, toNewEntryOfPatient } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});
router.get("/:id", (req, res) => {
  res.send(patientService.getOneEntry(req.params.id));
});
router.post("/", (req, res) => {
  try {
    const newEntry = toNewPatientEntry(req.body);
    const newPatientEntry = patientService.addPatient(newEntry);
    res.json(newPatientEntry);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.status(500).send(e.message);
  }
});
router.post("/:id/entries", (req, res) => {
  try {
    const newEntry = toNewEntryOfPatient(req.body);

    const addNewEntry = patientService.addEntry(req.params.id, newEntry);
    res.json(addNewEntry);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.status(500).send(e.message);
  }
});
export default router;

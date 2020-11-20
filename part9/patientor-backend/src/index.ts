import express from "express";
import cors from "cors";
import diagnosesRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";
// import bodyParser from "body-parser";
const app = express();
app.use(express.json());

const PORT = 3001;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});
app.use("/api/diagnosis", diagnosesRouter);
app.use("/api/patients", patientRouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

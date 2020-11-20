import express from "express";

const app = express();
import { calculateBmi } from "./BMI";
import { calculateExercises } from "./exerciseCalculator";
import bodyParser from "body-parser";

app.get("/hello", (_req, res) => {
  res.send("Hello FullStack");
});
app.get("/bmi", (req, res) => {
  try {
    let value1: number;
    let value2: number;
    if (!req.query.height || !req.query.weight) {
      throw new Error("Not enough arguments");
    }
    if (!isNaN(Number(req.query.height)) && !isNaN(Number(req.query.weight))) {
      value1 = Number(req.query.height);
      value2 = Number(req.query.weight);
    } else {
      throw new Error("Provided values were not numbers!");
    }
    res.send(calculateBmi(value1, value2));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.status(400).send(`error: ${String(e.message)}`);
  }
});
interface Request {
  url: string;
  daily_exercises: Array<number>;
  target: number;
}
app.post("/exercises", bodyParser.json(), (request, response) => {
  try {
    const req: Request = request.body as Request;

    if (!req.daily_exercises || !req.target) {
      throw new Error("parameters missing");
    }
    for (let k = 0; k < req.daily_exercises.length; k++) {
      if (isNaN(Number(req.daily_exercises[k]))) {
        throw new Error("Provided values were not numbers!");
      }
    }

    if (isNaN(Number(req.target))) {
      throw new Error("malformatted parameters");
    }
    response.send(calculateExercises(req.target, req.daily_exercises));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    response.status(400).send(`error: ${String(e.message)}`);
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

interface result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}
interface inputs {
  value1: number;
  value2: Array<number>;
}
const parseInput = (args: Array<string>): inputs => {
  const secondArg: Array<number> = [];
  for (let k = 3; k < args.length; k++) {
    if (isNaN(Number(args[k]))) {
      throw new Error("Provided values were not numbers!");
    }
    secondArg.push(Number(args[k]));
  }
  return {
    value1: Number(args[2]),
    value2: secondArg,
  };
};
const calculateExercises = (
  target: number,
  exercises: Array<number>
): result => {
  const periodLength: number = exercises.length;
  let trainingDays = 0;
  let success = false;
  let rating = 0;
  let ratingDescription: string;
  let totalHour = 0;
  exercises.map((exercise) => {
    if (exercise != 0) {
      trainingDays += 1;
    }
    totalHour += exercise;
  });
  const average: number = totalHour / periodLength;
  if (target <= average) {
    success = true;
    rating = 3;
    ratingDescription = "You have met the target. Great job";
  } else {
    success = false;
    const successPercentage: number = (average / target) * 100;
    if (successPercentage < 33) {
      rating = 0;
      ratingDescription = "Far too behind target. Work harder";
    } else if (successPercentage < 66) {
      rating = 1;
      ratingDescription = "A little more work to do. Keep going";
    } else {
      rating = 2;
      ratingDescription = "not bad but could be better";
    }
  }
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};
try {
  const { value1, value2 } = parseInput(process.argv);
  console.log(calculateExercises(value1, value2));
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log("Error, something bad happened, message: ", e.message);
}
export { calculateExercises };

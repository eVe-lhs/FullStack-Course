import React from "react";
import ReactDOM from "react-dom";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends CoursePartWithDescription {
  name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartWithDescription {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}
interface CoursePartFour extends CoursePartWithDescription {
  name: "Advanced";
  extension: string;
}

type CoursePart =
  | CoursePartOne
  | CoursePartTwo
  | CoursePartThree
  | CoursePartFour;

const Header: React.FC<{ name: string }> = ({ name }) => <h1> {name} </h1>;

const Part: React.FC<{ coursePart: CoursePart }> = ({ coursePart }) => {
  switch (coursePart.name) {
    case "Fundamentals":
      return (
        <p>
          {coursePart.name}, {coursePart.exerciseCount},{" "}
          {coursePart.description}
        </p>
      );

    case "Using props to pass data":
      return (
        <p>
          {coursePart.name} ,{coursePart.exerciseCount}
          {coursePart.groupProjectCount}
        </p>
      );
    case "Deeper type usage":
      return (
        <p>
          {coursePart.name}, {coursePart.exerciseCount},{coursePart.description}{" "}
          ,{coursePart.exerciseSubmissionLink}
        </p>
      );
    case "Advanced":
      return (
        <p>
          {coursePart.name}, {coursePart.exerciseCount} ,
          {coursePart.description},{coursePart.extension}
        </p>
      );
    default:
      return assertNever(coursePart);
  }
};
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
const Content: React.FC<{ courseParts: Array<CoursePart> }> = ({
  courseParts,
}) => {
  return (
    <div>
      {courseParts.map((coursePart) => (
        <Part coursePart={coursePart} />
      ))}
    </div>
  );
};
const Total: React.FC<{ courseParts: Array<CoursePart> }> = ({
  courseParts,
}) => {
  return (
    <p>
      Number of exercises -
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};
const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
    },
    {
      name: "Advanced",
      exerciseCount: 15,
      description: "This is not for beginners",
      extension: "React,Redux and Firebase",
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

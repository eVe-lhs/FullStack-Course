import React from "react";
import ReactDOM from "react-dom";

const Course = ({ course }) => {
  return (
    <div key={course.id}>
      <Header header={course.name} />
      <Content content={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};
const Header = ({ header }) => {
  return <h1>{header}</h1>;
};
const Content = ({ content }) => {
  return (
    <div>
      {content.map((part) => (
        <Part key={part.id} exercises={part.exercises} name={part.name} />
      ))}
    </div>
  );
};
const Total = ({ parts }) => {
  const exercises = parts.map((part) => part.exercises);
  let sum = exercises.reduce(function (a, b) {
    return a + b;
  }, 0);
  //   parts.map((part) => (total += part.exercises));
  return <p>total of {sum} exercises</p>;
};

const Part = ({ exercises, name }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  );
};
const courses = [
  {
    name: "Half Stack application development",
    id: 1,
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
      {
        name: "Redux",
        exercises: 11,
        id: 4,
      },
    ],
  },
  {
    name: "Node.js",
    id: 2,
    parts: [
      {
        name: "Routing",
        exercises: 3,
        id: 1,
      },
      {
        name: "Middlewares",
        exercises: 7,
        id: 2,
      },
    ],
  },
];
const App = ({ courses }) => {
  return courses.map((course) => <Course course={course} key={course.id} />);
};
ReactDOM.render(<App courses={courses} />, document.getElementById("root"));

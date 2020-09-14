import ReactDOM from "react-dom";
import React, { useState } from "react";

const Statistics = ({ good, neutral, bad, count, total }) => {
  if (count > 0) {
    return (
      <div>
        <h1>statistics</h1>
        <table>
          <tbody>
            <tr>
              <td> good </td>
              <td> {good}</td>
            </tr>
            <tr>
              <td> neutral </td>
              <td> {neutral}</td>
            </tr>
            <tr>
              <td> bad </td>
              <td> {bad}</td>
            </tr>
            <tr>
              <td> all </td>
              <td> {count}</td>
            </tr>
            <tr>
              <td> average </td>
              <td> {total / count}</td>
            </tr>
            <tr>
              <td> positive </td>
              <td>{(good / count) * 100 + "%"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div>
      <h1>statistics</h1>
      <p>No feedback given</p>
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  return (
    <div>
      <h1>give feedback</h1>
      <button
        onClick={() => {
          setGood(good + 1);
          setCount(count + 1);
          setTotal(total + 1);
        }}
      >
        good
      </button>
      <button
        onClick={() => {
          setNeutral(neutral + 1);
          setCount(count + 1);
        }}
      >
        neutral
      </button>
      <button
        onClick={() => {
          setBad(bad + 1);
          setCount(count + 1);
          setTotal(total - 1);
        }}
      >
        bad
      </button>
      <Statistics
        good={good}
        bad={bad}
        neutral={neutral}
        total={total}
        count={count}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

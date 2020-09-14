import React, { useState } from "react";
import ReactDOM from "react-dom";

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState([0, 0, 0, 0, 0, 0]);
  const [max, setMax] = useState(0);
  const getRandom = () => setSelected(Math.floor(Math.random() * 6));
  const voting = (selected) => {
    const newVote = { ...vote, [selected]: vote[selected] + 1 };
    setVote(newVote);
    if (vote[selected] >= vote[max]) setMax(selected);
  };
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has vote {vote[selected]}</p>
      <button onClick={() => voting(selected)}>vote</button>
      <button onClick={getRandom}>next anecdotes</button>
      <h1>Anecdote with most most votes</h1>
      <p>{props.anecdotes[max]}</p>
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));

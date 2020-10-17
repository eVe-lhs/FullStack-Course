import React from "react";
import { connect } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNoti } from "../reducers/notificationReducer";

const AnecdoteList = (props) => {
  var anecdotes;
  if (props.filter === "") {
    anecdotes = props.anecdotes;
  } else {
    anecdotes = props.anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(props.filter.toLowerCase())
    );
  }
  console.log();
  anecdotes.sort((a, b) => {
    return b.votes - a.votes;
  });

  const voteAnec = (id) => {
    const anecdote = anecdotes.find((anecdote) => anecdote.id === id);
    props.vote(anecdote, id);
    props.setNoti(
      `you voted '${anecdote.content}'`,
      5,
      props.notification.timeout
    );
  };
  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnec(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};
const mapDispatchToProps = {
  vote,
  setNoti,
};
const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter,
    notification: state.notifications,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList);

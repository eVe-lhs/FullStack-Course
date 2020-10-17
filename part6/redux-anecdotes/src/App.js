import React, { useEffect } from "react";
import AnecdotesList from "./components/anecdoteList";
import AnecdoteForm from "./components/anecdoteForm";
import Notification from "./components/Notification";
import Filter from "./components/filter";
import { connect } from "react-redux";
import { initAnecs } from "./reducers/anecdoteReducer";

const App = (props) => {
  useEffect(() => {
    props.initAnecs();
  }, [props]);
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdotesList />
      <AnecdoteForm />
    </div>
  );
};
const mapDispatchToProps = {
  initAnecs,
};
export default connect(null, mapDispatchToProps)(App);

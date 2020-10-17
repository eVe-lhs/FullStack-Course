import React from "react";
import { connect } from "react-redux";
import { add } from "../reducers/anecdoteReducer";
import { setNoti } from "../reducers/notificationReducer";

const AnecdoteForm = (props) => {
  const addNew = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    props.add(content);
    props.setNoti(`new anecdote '${content}'`, 5, props.notification.timeout);
    event.target.anecdote.value = "";
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addNew}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};
const mapStateToProps = (state) => {
  return { notification: state.notifications };
};
const mapDispatchToProps = {
  add,
  setNoti,
};
export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteForm);

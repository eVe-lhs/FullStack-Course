import React, { useState } from "react";
import { useField } from "../hooks";
import { useHistory } from "react-router-dom";

const CreateNew = (props) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    props.addNew({
      content,
      author,
      info,
      votes: 0,
    });
    history.push("/");
  };
  const reset = (e) => {
    e.preventDefault();
    content.reset();
    author.reset();
    info.reset();
  };
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            value={content.value}
            type={content.type}
            onChange={content.onChange}
          />
        </div>
        <div>
          author
          <input
            value={author.value}
            type={author.type}
            onChange={author.onChange}
          />
        </div>
        <div>
          url for more info
          <input value={info.value} type={info.type} onChange={info.onChange} />
        </div>
        <button onClick={handleSubmit}>create</button>
        <button onClick={reset}>reset</button>
      </form>
    </div>
  );
};
export default CreateNew;

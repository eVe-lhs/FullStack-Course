import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };
  const reset = () => {
    setValue("");
  };
  return {
    type,
    value,
    onChange,
    reset,
  };
};

const useResource = (baseUrl) => {
  const getId = () => (100000 * Math.random()).toFixed(0);
  const [resources, setResources] = useState([]);
  useEffect(() => {
    axios.get(baseUrl).then((response) => setResources(response.data));
  }, [baseUrl]);

  const create = (resource) => {
    const newObject = {
      ...resource,
      id: Number(getId()),
    };
    axios
      .post(baseUrl, newObject)
      .then((response) => setResources(resources.concat(response.data)))
      .catch((err) => console.log(err));
  };

  const service = {
    create,
  };

  return [resources, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
    content.reset();
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
    name.reset();
    number.reset();
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input
          type={content.type}
          value={content.value}
          onChange={content.onChange}
        />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name
        <input type={name.type} value={name.value} onChange={name.onChange} />
        <br />
        number
        <input
          type={number.type}
          value={number.value}
          onChange={number.onChange}
        />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;

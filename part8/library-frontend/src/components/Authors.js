import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { All_Authors, SET_BORN } from "../quries";
import Select from "react-select";
const Authors = (props) => {
  const [name, setName] = useState(null);
  const [bornYear, setBornYear] = useState("");
  const result = useQuery(All_Authors);
  const [error, setError] = useState();
  const [editBorn, resultBorn] = useMutation(SET_BORN, {
    refetchQueries: [{ query: All_Authors }],
    onError: (error) => {
      setError("Inputs not satisfied");
      setTimeout(() => {
        setError(null);
      }, 5000);
    },
  });
  useEffect(() => {
    if (resultBorn.data && resultBorn.data.editNumber === null) {
      setError("author not found");
    }
  }, [result.data]); // eslint-disable-line
  let authors;

  if (!props.show) {
    return null;
  }
  if (result.loading) {
    return <div>loading...</div>;
  } else {
    authors = result.data.allAuthors;
  }

  var options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }));
  const submit = async (event) => {
    event.preventDefault();
    const year = Number(bornYear);
    const Name = name.value;

    editBorn({ variables: { name: Name, year } });
    setName(null);
    setBornYear("");
  };
  return (
    <div>
      {error ? <div style={{ color: "red" }}>{error}</div> : null}
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set Birthyear</h2>
      <div>
        <Select defaultValue={name} onChange={setName} options={options} />
      </div>
      <div>
        born
        <input
          type="number"
          value={bornYear}
          onChange={({ target }) => setBornYear(target.value)}
        />
      </div>
      <button onClick={submit}>Update author</button>
    </div>
  );
};

export default Authors;

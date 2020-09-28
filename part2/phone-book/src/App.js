import React, { useState, useEffect } from "react";
import numberService from "./services/numbers";
const Filter = ({ onChange, value }) => {
  return (
    <div>
      filter shown with
      <input onChange={onChange} value={value} />
    </div>
  );
};
const AddNew = ({ onNameChange, onPhoneChange, name, phone, onSubmit }) => {
  return (
    <form>
      <h3>Add a new</h3>
      <div>
        name: <input onChange={onNameChange} value={name} />
      </div>
      <div>
        Phone: <input onChange={onPhoneChange} value={phone} />
      </div>
      <div>
        <button type="submit" onClick={onSubmit}>
          add
        </button>
      </div>
    </form>
  );
};
const Numbers = ({ persons, onDel }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <div key={person.name}>
          {person.name} {person.phoneNumber}
          <button onClick={() => onDel(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};
const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null;
  }
  return <div className={messageType}>{message}</div>;
};
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  useEffect(() => {
    numberService.getNumbers().then((data) => setPersons(data));
  }, []);
  const handleNameInput = (e) => {
    setNewName(e.target.value);
  };
  const handlePhoneInput = (e) => {
    setNewPhone(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newObject = {
      name: newName,
      phoneNumber: newPhone,
    };
    const person = persons.find((p) => p.name === newName);
    const changedNumber = { ...person, phoneNumber: newPhone };
    if (persons.includes(person)) {
      if (person.name === newName) {
        if (
          window.confirm(
            `${newName} is already in the phonebook, replace the old number with a new one?`
          )
        )
          numberService
            .update(person.id, changedNumber)
            .then((response) =>
              setPersons(
                persons.map((p) => (p.id !== person.id ? p : response))
              )
            )
            .then(() => {
              setMessage(`Updated ${newObject.name}`);
              setMessageType("success");
              setTimeout(() => {
                setMessage(null);
                setMessageType(null);
              }, 5000);
            })
            .catch((error) => {
              setMessage(error.response.data.error);
              setMessageType("error");
              setTimeout(() => {
                setMessage(null);
                setMessageType(null);
              }, 5000);
            });
      }
    } else
      numberService
        .addNew(newObject)
        .then((data) => setPersons(persons.concat(data)))
        .then(() => {
          setMessage(`Added ${newObject.name}`);
          setMessageType("success");
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setMessage(error.response.data.error);
          // error.name
          // `${
          //   newObject.name.length < 3 || newObject.phoneNumber.length < 8
          //     ? "Name must be at least 3 characters or number must be at least 8 degit"
          //     : error.message
          // }`
          setMessageType("error");
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 5000);
        });

    setNewName("");
    setNewPhone("");
  };
  const deleteNumber = (id) => {
    if (window.confirm("are you sure u want to delete?")) {
      numberService
        .del(id)
        .then(() => {
          setMessage(
            `Deleted ${persons.find((person) => person.id === id).name}`
          );
          setMessageType("success");
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 5000);
        })
        .catch((error) => {
          setMessage(
            `Information of ${
              persons.find((person) => person.id === id).name
            } has already been removed from server`
          );
          setMessageType("error");
          setTimeout(() => {
            setMessage(null);
            setMessageType(null);
          }, 5000);
        });
    }
  };
  const [filter, setFilter] = useState("");
  const handleFilter = (e) => {
    setFilter(e.target.value);
  };
  let personsFiltered = persons;
  if (filter !== "") {
    personsFiltered = persons.filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType} />
      <Filter onChange={handleFilter} value={filter} />

      <AddNew
        onNameChange={handleNameInput}
        onPhoneChange={handlePhoneInput}
        name={newName}
        phone={newPhone}
        onSubmit={onSubmit}
      />
      <Numbers persons={personsFiltered} onDel={deleteNumber} />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/recommend";
import LoginForm from "./components/loginForm";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { Current_User, BOOK_ADDED, All_Books } from "./quries";
const App = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    setToken(token);
  }, [setToken]);

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: All_Books });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: All_Books,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      setSuccess(`${addedBook.title} added`);
      setTimeout(() => {
        setSuccess(null);
      }, 10000);
      updateCacheWith(addedBook);
    },
  });

  const result = useQuery(Current_User);
  if (result.loading) {
    return null;
  }
  const user = result.data.me;
  return (
    <div>
      {error ? <div style={{ color: "red" }}>{error}</div> : null}
      {success ? <div style={{ color: "green" }}>{success}</div> : null}
      {!token ? (
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("login")}>login</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <button onClick={() => setPage("add")}>add book</button>
          <button onClick={() => setPage("recommend")}>recommend</button>
          <button onClick={logout}>log out</button>
        </div>
      )}
      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setError={setError}
        setPage={setPage}
      />
      {user ? <Recommend show={page === "recommend"} user={user} /> : null}

      <NewBook
        show={page === "add"}
        setError={setError}
        updateCacheWith={updateCacheWith}
      />
    </div>
  );
};

export default App;

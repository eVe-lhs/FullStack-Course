import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { All_Books, All_Books_By_Genre } from "../quries";
const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("all genre");
  const [getBooks, result] = useLazyQuery(All_Books_By_Genre);
  const [getAllBooks, resultAllBooks] = useLazyQuery(All_Books);
  useEffect(() => {
    getAllBooks();
  }, [getAllBooks]);
  useEffect(() => {
    if (genre === "all genre") {
      if (resultAllBooks.data) {
        setBooks(resultAllBooks.data.allBooks);
      }
    } else {
      if (result.data) {
        setBooks(result.data.allBooks);
      }
    }
  }, [resultAllBooks, result, genre]);
  if (!props.show) {
    return null;
  }
  if (result.loading || resultAllBooks.loading) {
    return <div>Loading...</div>;
  }
  const showAll = () => {
    getAllBooks();
    setGenre("all genre");
  };
  const showBooks = (genre) => {
    getBooks({ variables: { genre } });

    setGenre(genre);
  };

  return (
    <div>
      <h2>books</h2>
      in genre <strong>{genre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => showBooks("refactoring")}>refactoring</button>
        <button onClick={() => showBooks("agile")}>agile</button>
        <button onClick={() => showBooks("patterns")}>patterns</button>
        <button onClick={() => showBooks("design")}>design</button>
        <button onClick={() => showBooks("crime")}>crime</button>
        <button onClick={() => showBooks("classic")}>classic</button>
        <button onClick={() => showBooks("comedy")}>comedy</button>
        <button onClick={showAll}>all genre</button>
      </div>
    </div>
  );
};

export default Books;

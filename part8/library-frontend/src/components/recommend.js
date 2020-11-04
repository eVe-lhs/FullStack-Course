import React from "react";
import { useQuery } from "@apollo/client";
import { All_Books_By_Genre } from "../quries";
const Books = (props) => {
  let books;
  const favoriteGenre = props.user.favoriteGenre;
  const result = useQuery(All_Books_By_Genre, {
    variables: { genre: favoriteGenre.toLowerCase() },
  });

  if (!props.show) {
    return null;
  }
  if (result.loading) {
    return <div>Loading...</div>;
  } else {
    books = result.data.allBooks;
  }
  return (
    <div>
      <h2>books</h2>
      in genre <strong>{props.user.favoriteGenre}</strong>
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
    </div>
  );
};

export default Books;

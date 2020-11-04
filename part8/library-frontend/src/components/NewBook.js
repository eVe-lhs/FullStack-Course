import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_BOOK, All_Authors } from "../quries";
const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: All_Authors }],
    onError: (error) => {
      console.log(error);
      props.setError("Input error");
      setTimeout(() => {
        props.setError(null);
      }, 5000);
    },
    update: (store, response) => {
      props.updateCacheWith(response.data.addBook);
    },
  });
  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    const numPublished = Number(published);
    addBook({
      variables: {
        title,
        author,
        published: numPublished,
        genres: genres.length > 0 ? genres : null,
      },
    });
    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;

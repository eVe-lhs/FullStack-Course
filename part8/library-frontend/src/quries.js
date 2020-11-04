import { gql } from "@apollo/client";

export const All_Authors = gql`
  query {
    allAuthors {
      name
      id
      bookCount
      born
    }
  }
`;

const BOOK_DETAIL = gql`
  fragment BookDetails on Book {
    title
    author {
      name
    }
    published
    genres
  }
`;

export const All_Books = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAIL}
`;
export const Current_User = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;
export const All_Books_By_Genre = gql`
  query getBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAIL}
`;
export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAIL}
`;
export const SET_BORN = gql`
  mutation EDIT_AUTHOR($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year) {
      name
      id
      bookCount
      born
    }
  }
`;
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAIL}
`;

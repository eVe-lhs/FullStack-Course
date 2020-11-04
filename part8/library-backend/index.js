require("dotenv").config();
const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
  PubSub,
} = require("apollo-server");
const Book = require("./models/books");
const Author = require("./models/authors");
const User = require("./models/user");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "NEED_HERE_A_SECRET_KEY";
const pubSub = new PubSub();
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Author {
    name: String!
    id: ID!
    bookCount: Int!
    born: Int
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate("author", { name: 1 });
      if (!args.author && !args.genre) {
        return books;
      } else {
        return books.filter((book) => {
          let haveAuthor = true;
          let haveGenre = true;
          if (args.author) {
            haveAuthor = book.author.name === args.author;
          }
          if (args.genre) {
            haveGenre = book.genres.includes(args.genre);
          }
          return haveGenre && haveAuthor;
        });
      }
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Book: {
    author: async (root) => {
      return {
        name: root.author.name,
        born: root.author.born,
        bookCount: root.author.bookCount,
      };
    },
  },
  Author: {
    bookCount: async (root) => {
      // let count = 0;
      // const books = await Book.find({});
      // books.map((book) => (book.author === root.id ? count++ : count));
      // return count;
      return Book.find({ author: root.id }).countDocuments();
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        const newAuthor = new Author({ name: args.author, born: null });
        await newAuthor.save();
        author = await Author.findOne({ name: args.author });
      }
      const book = new Book({ ...args, author: author._id });
      try {
        await book.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      }
      const returnBook = await Book.findOne({ title: args.title }).populate(
        "author",
        {
          name: 1,
        }
      );
      pubSub.publish("BOOK_ADDED", { bookAdded: returnBook });
      return returnBook;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }
      let author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      } else {
        author.born = args.setBornTo;
        author.save();
        return author;
      }
    },
    createUser: (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscription ready at ${subscriptionsUrl}`);
});

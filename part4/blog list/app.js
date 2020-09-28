const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middlewares");
const blogRouter = require("./controllers/blogs");
const { model } = require("./models/blog");
logger.info("Connecting to database");
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(logger.info(`connected to database`))
  .catch((error) =>
    logger.error(`Error connecting to database`, error.message)
  );

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/blogs", blogRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

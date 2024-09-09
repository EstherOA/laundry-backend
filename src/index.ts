#!/usr/bin/env node

const http = require("http");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const routeHandler = require("./routes");
const setupPassport = require("./lib/passport");

const app = express(config);
const passport = setupPassport(config);

const connectToMongoose = async () => {
  return mongoose.connect(config.mongodb.url);
};

const port = process.env.PORT || "3000";
app.set("port", port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors({ origin: "*" }));
app.use("/", routeHandler(config));

const server = http.createServer(app);

const onError = (error: any) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;

  console.info(`${config.applicationName} listening on ${bind}`);
};

server.on("error", onError);
server.on("listening", onListening);

connectToMongoose()
  .then(() => {
    console.info("Successfully connected to MongoDB");
    server.listen(port);
  })
  .catch((error) => {
    console.error(error);
  });

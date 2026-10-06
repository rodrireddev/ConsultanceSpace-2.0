const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const routes = require("./routes");

require("./db");

const server = express();
server.name = "API";

server.use(helmet());
server.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json({ limit: "50mb" }));
server.use(cookieParser());
if (config.nodeEnv !== "test") server.use(morgan("dev"));

server.use("/", routes);

// Error catching endware.
// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  const status = err.status || (err.name?.startsWith("Sequelize") ? 400 : 500);
  if (status >= 500) console.error(err);
  res.status(status).send(err.message || String(err));
});

module.exports = server;

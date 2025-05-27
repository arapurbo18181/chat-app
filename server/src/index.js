require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth.route");
const config = require("./config/config");
const { connectDb } = require("./connection");

const app = express();
const port = config.port;
const dbUrl = config.db.baseUrl;

// ! Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ! Routes
app.use("/api/auth", authRoutes);

// ! Port Connection
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);

  // ! DB Connection
  connectDb(dbUrl);
});

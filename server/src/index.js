require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./connection");
const cors = require("cors");

const app = express();
const port = config.port;
const dbUrl = config.db.baseUrl;

// ! Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ! Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// ! Port Connection
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);

  // ! DB Connection
  connectDb(dbUrl);
});

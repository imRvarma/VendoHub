
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("MongoDB URI loaded:", Boolean(process.env.MONGO_URI));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

app.get("/", (req, res) => {
  res.send("MERN backend is running!");
});
//define routes
const authRoutes =require("./routes/auth");
//use routes
app.use("/api/auth",authRoutes);
//exports app
module.exports = app;

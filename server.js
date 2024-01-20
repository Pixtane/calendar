const express = require("express");
const app = express();

require("dotenv").config();

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/public/favicon.ico")
})

app.get("/styles", (req, res) => {
  res.sendFile(__dirname + "/public/build/styles.css");
});

app.get("/script", (req, res) => {
  res.sendFile(__dirname + "/src/script.js");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

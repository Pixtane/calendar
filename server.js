const express = require("express");
const app = express();
const fs = require("fs").promises;

require("dotenv").config();

const port = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/public/favicon.ico");
});

app.get("/styles", (req, res) => {
  res.sendFile(__dirname + "/public/build/styles.css");
});

app.get("/script", (req, res) => {
  res.sendFile(__dirname + "/src/script.js");
});

app.get("/data", async (req, res) => {
  try {
    // Extract the date parameter from the request query
    const requestedDate = req.query.date;

    // Read the JSON data from the file
    const dataFilePath = __dirname + "/public/user/data.json";
    const rawData = await fs.readFile(dataFilePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    // Get the relevant data for the requested date
    const relevantData = jsonData[requestedDate] || [];

    // Send the relevant data as JSON
    res.json(relevantData);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/setdata", async (req, res) => {
  try {
    const { date, time, title, description } = req.body;

    // Read the existing JSON data from the file
    const dataFilePath = __dirname + "/public/user/data.json";
    const rawData = await fs.readFile(dataFilePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    // Ensure there is an entry for the specified date
    jsonData[date] = jsonData[date] || [];

    // Add the new data to the specified date
    jsonData[date].push({ time, title, description });

    // Write the updated data back to the file
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(jsonData, null, 2),
      "utf-8"
    );

    res.json({ success: true });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

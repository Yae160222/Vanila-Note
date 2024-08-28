// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AppModel = require("./models/M-Note");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" })); // Increase to 50 MB
app.use(express.urlencoded({ limit: "100mb", extended: true }));

const mongoURI = "mongodb://localhost:27017/M-Note";
mongoose.connect(mongoURI);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/getAppData", async (req, res) => {
  const appData = await AppModel.find();
  if (appData) {
    return res.json(appData);
  } else {
    return res.json({
      boards: [
        {
          elements: [],
        },
      ],
    });
  }
});

app.post("/saveData", async (req, res) => {
  try {
    const { data } = req.body;
    await AppModel.deleteMany({});
    const newAppData = new AppModel({
      boards: data,
    });
    await newAppData.save();
    res.status(201).send("added");
  } catch (error) {
    res.status(500).send("An error occurred while saving the data");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

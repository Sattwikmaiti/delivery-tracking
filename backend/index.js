const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Connected to database"));

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

app.use(router);

app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;

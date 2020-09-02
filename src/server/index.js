require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

app.get("/photos", async (req, res) => {
  try {
    console.log(req)
    let photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send(photos);
  } catch (err) {
    console.log("error:", err);
  }
});

app.post("/photos", async (req, res) => {
  try {
    console.log("Calling API")

    let photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.rover.toLowerCase()}/photos?sol=${req.body.sol}&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send(photos);
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

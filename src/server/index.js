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

app.post("/photos", async (req, res) => {
  try {
    let photos = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.rover.toLowerCase()}/latest_photos?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send(photos.latest_photos.map(p => {
      return {
        img_src: p.img_src,
        earth_date: p.earth_date,
        landing_date: p.rover.landing_date,
        launch_date: p.rover.launch_date,
        status: p.rover.status
      }
    }));
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

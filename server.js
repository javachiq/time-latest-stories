const express = require("express");
const https = require("https");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/getLatestStories", (req, res) => {
  https
    .get("https://time.com", (resp) => {
      const data = [];
      resp.on("data", (d) => {
        data.push(d);
      });

      resp.on("end", () => {
        const titles = data
          .join("")
          .match(
            /(?<=class="(latest-stories__item-headline)">)(.*?)(?=<\/h3>)/g
          );

        const output = [];
        for (let i = 0; i < titles.length; i++) {
          output.push({ title: titles[i] });
        }
        console.log(output);
        res.json(output);
      });
    })
    .on("error", (e) => {
      console.error(e);
    });
});

app.get("/", (req, res) => {
  res.json({ message: "Nothing to do here" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`##### Server is running on port ${PORT}. ######`);
});

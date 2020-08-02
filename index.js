if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
app.use(express.static("build"));

const port = process.env.PORT;
app.get("/*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

app.listen(port, () => console.log(`Peer app started`));

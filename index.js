if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { ExpressPeerServer: peerWare } = require("peer");
const path = require("path");

const app = express();
app.use(express.static("build"));

const port = process.env.PORT;
const key = process.env.PEER_KEY;
const server = app.listen(port, () => console.log(`Peer app started`));

const peerServer = peerWare(server, {
  key,
  port,
  path: "/ourApp",
  proxied: true,
});

app.use("/", peerServer);

app.get("/*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

const express = require("express");

const app = express();

app.use(
  express.static("build", {
    maxAge: 10000 * 30,
  })
);

app.listen(1001);

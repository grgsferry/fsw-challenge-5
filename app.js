const express = require("express");
const app = express();
const router = require(__dirname + "/router");
const api = require(__dirname + "/api");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use(router);
app.use("/api", api);

app.use(function (err, req, res, next) {
  res.status(500).json({
    status: "fail",
    errors: err.message,
  });
});

app.use(function (req, res) {
  res.status(404).json({
    status: "fail",
    errors: "Are you lost?",
  });
});

app.listen(3000, () => console.log(`App is listening on port localhost:3000.`));

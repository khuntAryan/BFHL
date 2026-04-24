const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const bfhlRoute = require("./routes/bfhl");

app.use("/", bfhlRoute);

app.listen(3000, () => console.log("Server running on port 3000"));
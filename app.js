require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
require("./config/connection");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
mongoose.set("debug", true);
const cors = require("cors");
app.use(cors());

app.get("/", (req, res, next) => {
  res.send("Hello Job Portal");
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json({ limit: "150mb" }));
app.use(express.static(path.join(__dirname, "uploads")));


const employerRouter = require("./routes/employer");

app.use("/employer", employerRouter);

app.listen(process.env.PORT, () => {
  console.log("app is running on", process.env.PORT);
});

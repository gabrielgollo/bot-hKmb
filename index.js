require("dotenv").config();
const log4js = require("log4js");
log4js.configure("./src/config/log4js.json");
const logger = log4js.getLogger("app");

const express = require("express");
const router = require("./router");
const {
  CreateJobsController,
} = require("./src/controllers/createJobsController");
const app = express();

app.use(express.static("public"));
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Http Server started on http://localhost:${port}`);
});

CreateJobsController.mapJobs();

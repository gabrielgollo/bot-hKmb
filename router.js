const express = require("express");
const { CronService } = require("./src/config/cron");
const {
  CreateJobsController,
} = require("./src/controllers/createJobsController");
const router = express.Router();
const startedTime = new Date().getTime();

router.get("/healthcheck", (req, res) => {
  try {
    const data = {
      tokens: process.env.TOKENS.split(","),
      status: "ok",
      uptime: new Date().getTime() - startedTime,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/initJobs", CreateJobsController.initializeJobs);

router.get("/info", (req, res) => {
  try {
    const jobs = CronService.info();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/startJobs", (req, res) => {
  try {
    CronService.startJobs();
    res.json({
      status: "ok",
      message: "Jobs started",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/stopJobs", (req, res) => {
  try {
    CronService.stopJobs();
    res.json({
      status: "ok",
      message: "Jobs stopped",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;

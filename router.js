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
      tokens: process.env.TOKENS.split(",").map((token) => token.slice(0, 5)),
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

router.get("/bots", async (req, res) => {
  try {
    const botsObject = CronService.getBots();
    const botsArray = Object.values(botsObject);

    if (botsArray.length > 0) {
      // sync all bots
      for (let i = 0; i < botsArray.length; i++) {
        const currBot = botsArray[i];
        await currBot.sync();
      }
    }

    const infos = {
      total: botsArray.length,
      bots: botsArray.map((bot) => {
        return {
          name: bot.telegramData.fullName,
          earnPassivePerHour: bot.clickerUser.earnPassivePerHour,
          balanceCoins: bot.clickerUser.balanceCoins,
          rank: bot.clickerUser.level,
          availableTaps: bot.clickerUser.availableTaps,
          lastSync: bot.clickerUser.lastSyncUpdate,
          cipher: bot.clickerConfig.dailyCipher.Decrypt(),
        };
      }),
    };

    res.json(infos);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

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

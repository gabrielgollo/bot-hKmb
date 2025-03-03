const { ExecuteBot } = require("../bot/botFactory");
const { CronService } = require("../config/cron");
const { parseTokensFromEnv } = require("../utils/parseTokens");

const SCHEDULER_CRON_TIME = process.env.SCHEDULER_CRON_TIME || "0/25 * * * *";
const logger = require("log4js").getLogger("CREATE_JOBS_CONTROLLER");
class CreateJobsController {
  static mapJobs() {
    // should run bot service for each token
    const tokens = parseTokensFromEnv();
    if (tokens.length === 0 || tokens[0] === "") {
      logger.error("No tokens found in .env file");
      return;
    }
    for (let i = 0; i < tokens.length; i++) {
      CronService.createJob(tokens[i], SCHEDULER_CRON_TIME, () =>
        ExecuteBot(tokens[i])
      );
    }
  }

  static async initializeJobs(req, res) {
    try {
      CreateJobsController.mapJobs();

      const data = {
        message: "Jobs initialized",
      };
      res.json(data);
    } catch (error) {
      logger.error("Error in CreateJobsController -> initializeJobs: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = { CreateJobsController };

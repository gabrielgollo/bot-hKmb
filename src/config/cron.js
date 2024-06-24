const { CronJob } = require("cron");
const logger = require("log4js").getLogger("CRON");

class Job {
  constructor(data) {
    this.id = data.id;
    this.createdAt = new Date();
    this.status = "stopped";
    this.job = data.job;
  }

  stop() {
    if (this.status === "stopped") return;
    this.job.stop();
    this.status = "stopped";
  }

  start() {
    if (this.status === "running") return;
    this.job.start();
    this.status = "running";
  }
}

const jobs = [];

class CronService {
  static createJob(id, time, callback) {
    // check if job already exists
    const jobIndex = jobs.findIndex((job) => job.id === id);
    if (jobIndex !== -1) {
      return;
    }

    logger.info(`Creating job for ${id.slice(0, 10)} at ${time}`);

    const functionToExecute = async () => {
      try {
        if (typeof callback === "function") {
          await callback();
        }
      } catch (error) {
        logger.error(`Error in job ${id}: ${error.message}`);
      }
    };

    const cronJob = new CronJob(time, functionToExecute, null, true);
    const jobData = new Job({
      id,
      nextExecutionAt: cronJob.nextDates(),
      job: cronJob,
    });
    jobData.start();

    jobs.push(jobData);
  }

  static startJobs() {
    jobs.forEach((jobData) => {
      jobData.start();
    });
  }

  static stopJobs() {
    jobs.forEach((jobData) => {
      jobData.stop();
    });
  }

  static info() {
    return jobs.map((jobData) => {
      return {
        id: jobData.id,
        status: jobData.status,
        lastExecutionAt: jobData.job.lastExecution,
        nextExecutionAt: jobData.job.nextDates(2),
        createdAt: jobData.createdAt,
      };
    });
  }

  static jobs() {
    return jobs;
  }

  static getJob(jobIndex) {
    return jobs[jobIndex];
  }

  static deleteJob(jobIndex) {
    jobs[jobIndex].stop();
    jobs.splice(jobIndex, 1);
  }

  static destroyJobs() {
    jobs.forEach((jobData) => {
      jobData.stop();
    });
    jobs.length = 0;
  }
}

module.exports = {
  CronService,
};

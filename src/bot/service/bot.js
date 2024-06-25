const { Exception } = require("../../errors/Exception");
const { createAxiosInstance } = require("../api/api");
const { ClickerConfig } = require("../dto/clickerConfig.dto");
const { ClickerUser } = require("../dto/clickerUser.dto");
const { Tasks } = require("../dto/tasks.dto");
const { TelegramData } = require("../dto/telegramData.dto");
const {
  UpgradeForBuyResponse,
} = require("../dto/upgradeForBuy/upgradesForBuy.dto");

class BotService {
  /**
   *
   * @param {string} token
   * @param {import("log4js").Logger} logger
   */
  constructor(token, logger) {
    this.token = token;
    this.api = createAxiosInstance(token);
    this.logger = logger;
    this.telegramData = null;
    this.clickerConfig = null;
    this.clickerUser = null;
  }

  async meTelegram() {
    try {
      const response = await this.api.post("/auth/me-telegram");
      this.telegramData = new TelegramData(response.data.telegramUser);
    } catch (error) {
      throw new Exception(
        500,
        `Error in meTelegram${error.message}`,
        "ERROR_TELEGRAM_ME"
      );
    }
  }

  async config() {
    try {
      const response = await this.api.post("/clicker/config");
      this.clickerConfig = new ClickerConfig(response.data);
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error`,
        error
      );

      throw new Exception(
        500,
        `Error in config${error.message}`,
        "ERROR_CONFIG"
      );
    }
  }

  async sync() {
    try {
      const response = await this.api.post("/clicker/sync");
      this.clickerUser = new ClickerUser(response.data.clickerUser);
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error`,
        error
      );
    }
  }

  async tap(count = 1) {
    try {
      const payload = {
        count: count,
        availableTaps: this.clickerUser.availableTaps,
        timestamp: new Date().getTime(), // in milliseconds
      };

      const user = await this.api.post("/clicker/tap", payload);

      this.clickerUser = new ClickerUser(user.data.clickerUser);
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error`,
        error
      );
    }
  }

  async claimDailyCipher() {
    try {
      await this.config();
      if (this.clickerConfig.dailyCipher.isClaimed) return;

      const decryptedCipher = this.clickerConfig.dailyCipher.Decrypt();
      const payload = {
        cipher: decryptedCipher,
      };

      await this.api.post("/clicker/claim-daily-cipher", payload);
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error`,
        error.response.message
      );
    }
  }

  async listTasks() {
    try {
      const response = await this.api.post("/clicker/list-tasks");
      return new Tasks(response.data.tasks);
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error`,
        error
      );
    }
  }

  async checkTask(taskId) {
    try {
      const payload = {
        taskId: taskId,
      };

      await this.api.post("/clicker/check-task", payload);
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - Task ${taskId} error check task`,
        error
      );
    }
  }

  async claimTasks() {
    try {
      this.logger.info(
        `${this.telegramData.id} - ${this.telegramData.fullName} - claimTasks`
      );
      const tasks = await this.listTasks();
      const dailyQuest = tasks.getStreakDaysTask();
      if (!dailyQuest.isCompleted) {
        await this.checkTask(dailyQuest.id);
      }

      const notCompletedTasks = tasks.getNotCompletedTasks();
      for (const task of notCompletedTasks) {
        try {
          this.logger.info("Checking task: ", task.id);
          await this.checkTask(task.id);
        } catch (error) {
          this.logger.error(
            `${this.telegramData.id} - ${this.telegramData.fullName} - Task ${task.id} error check task`,
            error
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error in claimTasks`,
        error
      );
    }
  }

  async getUpgradesForBuy() {
    try {
      const response = await this.api.post("/clicker/upgrades-for-buy");
      return new UpgradeForBuyResponse(response.data);
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error in upgradesForBuy`,
        error
      );
      throw new Exception(
        500,
        `Error in getUpgradesForBuy ${error?.response?.data || error.message}`,
        "ERROR_UPGRADES"
      );
    }
  }

  async buyUpgrade(upgradeId) {
    try {
      const payload = {
        upgradeId: upgradeId,
        timestamp: new Date().getTime(), // in milliseconds
      };

      const response = await this.api.post("/clicker/buy-upgrade", payload);
      if (response.data.clickerUser) {
        this.logger.warn("updating clickerUser in buyUpgrade");
        this.clickerUser = new ClickerUser(response.data.clickerUser);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error in buyUpgrade`,
        error.response.data
      );

      throw new Exception(
        500,
        `Error in buyUpgrade ${JSON.stringify(error.response.data)}`,
        "ERROR_BUY_UPGRADE"
      );
    }
  }
}

module.exports = { BotService };

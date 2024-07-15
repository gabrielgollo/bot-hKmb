const { Exception } = require("../../errors/Exception");
const { createAxiosInstance } = require("../api/api");
const { BoostsForBuyDto } = require("../dto/boostsForBuy/bootsForBuy.dto");
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

  /**
   * Realiza uma pausa assíncrona.
   * @param {number} ms - Tempo em milissegundos para esperar.
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
        `Error in getUpgradesForBuy ${JSON.stringify(error?.response?.data) || error.message}`,
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

  async listBoostsForBuy() {
    try {
      const response = await this.api.post("/clicker/boosts-for-buy");
      return new BoostsForBuyDto(response.data.boostsForBuy);
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error in listBoostsForBuy`,
        error
      );
      throw new Exception(
        500,
        `Error in listBoostsForBuy ${JSON.stringify(error?.response?.data || error.message)}`,
        "ERROR_LIST_BOOSTS"
      );
    }
  }

  async buyBoost(boostId) {
    try {
      const payload = {
        boostId: boostId,
        timestamp: new Date().getTime(), // in milliseconds
      };

      const response = await this.api.post("/clicker/buy-boost", payload);
      if (response.data.clickerUser) {
        this.logger.warn("updating clickerUser in buyBoost");
        this.clickerUser = new ClickerUser(response.data.clickerUser);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error in buyBoost`,
        error
      );

      throw new Exception(
        500,
        `Error in buyBoost ${JSON.stringify(error.response.data || error.message)}`,
        "ERROR_BUY_BOOST"
      );
    }
  }

  async tryRecoverEnergyForFree() {
    try {
      const boosts = await this.listBoostsForBuy();
      const boost = boosts.boostsForBuy.find(
        (boost) => boost.id === "BoostFullAvailableTaps"
      );

      if (boost.cooldownSeconds > 0 || boost.level >= boost.maxLevel) {
        return false;
      }

      this.logger.info(
        `${this.telegramData.id} - ${this.telegramData.fullName} - Recovering energy`
      );

      await this.buyBoost(boost.id);

      return true;
    } catch (error) {
      this.logger.error(
        `${this.telegramData.id} - ${this.telegramData.fullName} - error in checkBoostFullAvailableTaps`,
        error
      );

      return false;
    }
  }

  async runOutEnergy() {
    try {
      const savedTotalTaps = Number(this.clickerUser.availableTaps);
      const energyConsumedByTap = Number(this.clickerUser.earnPerTap);

      if (savedTotalTaps === 0) {
        this.logger.warn("No energy to tap");
        return 0;
      }

      const parsedQuantityOfTaps = Number(process.env.QUANTITY_OF_TAPS);

      const quantityOfTaps = isNaN(parsedQuantityOfTaps)
        ? 1
        : parsedQuantityOfTaps;
      const timeToWait = Number(process.env.TIME_BETWEEN_TAPS_IN_MS || 2100);

      if (quantityOfTaps <= 0) {
        this.logger.warn("QUANTITY_OF_TAPS is 0 or less");
        return 0;
      }

      let totalEnergy = Number(this.clickerUser.availableTaps);
      let totalCoinsEarned = 0;
      while (totalEnergy > 0) {
        const currentTaps = Math.min(
          Math.floor(totalEnergy / energyConsumedByTap),
          quantityOfTaps
        );

        if (currentTaps === 0) {
          this.logger.info("No more energy to tap");
          break;
        }
        await this.tap(currentTaps);

        // Atualiza a quantidade de taps disponíveis após o tap
        totalEnergy -= currentTaps * energyConsumedByTap;
        totalCoinsEarned += currentTaps * energyConsumedByTap;

        this.logger.info(
          `Tapped ${currentTaps} times - ${energyConsumedByTap} earnPerTap - ${totalEnergy} available energy - ${totalCoinsEarned} coins earned`
        );
        // Pausa entre os taps
        await this.sleep(timeToWait);
      }

      await this.sync();

      let totalEnergySaved = savedTotalTaps;
      // recover energy if return true and run again
      if (process.env.RECOVER_ENERGY === "true") {
        const recoveredEnergy = await this.tryRecoverEnergyForFree();
        this.sleep(200);
        if (recoveredEnergy) {
          await this.sync();
          const newSavedTaps = await this.runOutEnergy(this, this.logger);
          totalEnergySaved += newSavedTaps;
        }
      }

      return totalEnergySaved;
    } catch (error) {
      this.logger.error(
        "Error while running out energy",
        error?.response?.data || error.message
      );

      return 0;
    }
  }
}

module.exports = { BotService };

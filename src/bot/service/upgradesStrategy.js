/* eslint-disable no-unused-vars */
const {
  UpgradeInListing,
  UpgradesForBuy,
} = require("../dto/upgradeForBuy/upgradesForBuy.dto");
const { BotService } = require("./botService");

class UpgradesStrategy {
  /**
   *
   * @param {BotService} bot
   * @param {import("log4js").Logger} logger
   */
  constructor(bot, logger) {
    this.bot = bot;
    this.logger = logger;
    if (!this.bot) {
      throw new Error("BotService is required");
    }

    if (!this.logger) this.logger = console;
  }

  /**
   *
   * @param {UpgradeInListing} upgrade
   * @returns
   */
  async checkCondition(upgrade) {
    const user = this.bot.clickerUser;
    const currentBotStatus = user?.upgrades;

    if (!upgrade.condition) return true;

    if (upgrade.condition.type === "ByUpgrade") {
      // verificar se o upgrade está disponível em currentBotStatus
      const { upgradeId, level } = upgrade.condition;
      const currentUpgrade = currentBotStatus.getUpgradeById(upgradeId);
      if (!currentUpgrade) {
        this.logger.error(`Upgrade not found: ${upgradeId}`, currentBotStatus);
        return false;
      }
      return currentUpgrade?.level >= level;
    }

    if (upgrade.condition.type === "ReferralCount") {
      // verificar se o upgrade está disponível em currentBotStatus
      const userReferralCount = user.referralsCount;
      return (
        Number(userReferralCount) >= Number(upgrade.condition.referralCount)
      );
    }

    if (upgrade.condition.type === "MoreReferralsCount") {
      // verificar se o upgrade está disponível em currentBotStatus
      return false;
    }

    if (upgrade.condition.type === null) return true;

    if (upgrade.condition.type === "SubscribeTelegramChannel") {
      // verificar se o upgrade está disponível em currentBotStatus
      return true;
    }

    if (upgrade.condition.type === "LinkWithoutCheck") {
      // verificar se o upgrade está disponível em currentBotStatus
      return true;
    }

    if (upgrade.condition.type === "LinksToUpgradeLevel") {
      // verificar se o upgrade está disponível em currentBotStatus
      return true;
    }

    this.logger.error(
      `Condition not implemented: ${upgrade.condition.type}`,
      upgrade
    );
    return false;
  }

  /**
   *
   * @param {UpgradesForBuy} upgrades
   * @returns
   */
  async findBestUpgrades() {
    const upgradeForBuyResponse = await this.bot.getUpgradesForBuy();
    const upgrades = upgradeForBuyResponse.upgradesForBuy;

    if (!upgrades || upgrades?.length === 0) {
      this.logger.info("No upgrades available");
      return [];
    }

    this.bot.sync();
    // Filtrar upgrades disponíveis e não expirados
    const availableUpgrades = upgrades.filter(
      (upgrade) =>
        upgrade.isAvailable &&
        !upgrade.isExpired &&
        this.checkCondition(upgrade)
    );

    // Ordenar por delta de lucro por hora (profitPerHourDelta) decrescente e preço (price) crescente
    const upgradesWithEfficiency = availableUpgrades.map((upgrade) => {
      return {
        ...upgrade,
        efficiency: upgrade.price / upgrade.profitPerHourDelta,
      };
    });

    // Ordenar por eficiência crescente (menor valor é melhor)
    const sortedUpgrades = upgradesWithEfficiency.sort(
      (a, b) => a.efficiency - b.efficiency
    );

    return sortedUpgrades;
  }

  async run() {
    try {
      const upgrades = await this.findBestUpgrades();
      if (!upgrades || upgrades?.length === 0) {
        this.logger.info("No upgrades available");
        return;
      }

      const parsedQToBuy = Number(
        process.env.QUANTITY_UPGRADES_TO_BUY_EACH_TIME
      );

      const Q_TO_BUY = isNaN(parsedQToBuy) ? 1 : parsedQToBuy;

      if (Q_TO_BUY <= 0) {
        this.logger.warn("Q_TO_BUY is 0 or less");
        return;
      }

      const MAX_UPGRADES =
        upgrades.length > Q_TO_BUY ? Q_TO_BUY : upgrades.length;

      for (let i = 0; i < MAX_UPGRADES; i += 1) {
        const upgrade = upgrades[i];
        if (
          typeof upgrade.cooldownSeconds == "number" &&
          upgrade.cooldownSeconds > 0
        ) {
          this.logger.warn(
            `Upgrade ${upgrade.name} has a cooldown of ${upgrade.cooldownSeconds} seconds`
          );
          continue;
        }
        if (this.bot.clickerUser.balanceCoins > upgrade.price) {
          const hoursToGetMoneyBack = Number(
            upgrade.price / upgrade.profitPerHourDelta
          ).toFixed(3);

          this.logger.info(
            `${upgrade.name} - to level ${upgrade.level} - ${upgrade.profitPerHourDelta} profitPerHourDelta - ${upgrade.price} price - Hours to get money back: ${hoursToGetMoneyBack}`
          );

          await this.bot.buyUpgrade(upgrade.id);

          await new Promise((resolve) =>
            setTimeout(
              resolve,
              Number(process.env.TIME_BETWEEN_UPGRADES_IN_MS || 300)
            )
          );
        } else {
          this.logger.warn(
            `Not enough money to buy ${upgrade.name} - ${upgrade.price} price`
          );
        }
      }
    } catch (error) {
      this.logger.error(
        "Error in UpgradesStrategy",
        error?.response?.data || error.message
      );
    }
  }
}

module.exports = { UpgradesStrategy };

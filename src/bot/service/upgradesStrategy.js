const {
  UpgradeInListing,
  UpgradesForBuy,
} = require("../dto/upgradeForBuy/upgradesForBuy.dto");
const { BotService } = require("./bot");

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
    this.bot.sync();
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
    const upgrades = await this.findBestUpgrades();
    if (!upgrades || upgrades?.length === 0) {
      this.logger.info("No upgrades available");
      return;
    }

    const Q_TO_BUY =
      Number(process.env.QUANTITY_UPGRADES_TO_BUY_EACH_TIME) || 4;
    const MAX_UPGRADES =
      upgrades.length > Q_TO_BUY ? Q_TO_BUY : upgrades.length;

    for (let i = 0; i < MAX_UPGRADES; i += 1) {
      const upgrade = upgrades[i];

      if (this.bot.clickerUser.balanceCoins > upgrade.price) {
        const hoursToGetMoneyBack = Number(
          upgrade.price / upgrade.profitPerHourDelta
        ).toFixed(3);

        this.logger.info(
          `${upgrade.name} - to level ${upgrade.level} - ${upgrade.profitPerHourDelta} profitPerHourDelta - ${upgrade.price} price - Hours to get money back: ${hoursToGetMoneyBack}`
        );

        await this.bot.buyUpgrade(upgrade.id);

        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        this.logger.warn(
          `Not enough money to buy ${upgrade.name} - ${upgrade.price} price`
        );
      }
    }
  }
}

module.exports = { UpgradesStrategy };

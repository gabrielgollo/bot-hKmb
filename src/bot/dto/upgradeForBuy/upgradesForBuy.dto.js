const { ConditionFactory } = require("./conditions.dto");

class UpgradeInListing {
  constructor(data) {
    this.id = data?.id;
    this.name = data?.name;
    this.price = data?.price;
    this.profitPerHour = data?.profitPerHour;
    this.condition = ConditionFactory.create(data?.condition);
    this.section = data?.section;
    this.level = data?.level;
    this.currentProfitPerHour = data?.currentProfitPerHour;
    this.profitPerHourDelta = data?.profitPerHourDelta;
    this.isAvailable = data?.isAvailable;
    this.isExpired = data?.isExpired;
    this.totalCooldownSeconds = data?.totalCooldownSeconds;
  }
}

class UpgradesForBuy {
  constructor(upgrades = []) {
    this.upgrades = upgrades.map((upgrade) => new UpgradeInListing(upgrade));
  }
}

class DailyCombo {
  constructor(data) {
    this.upgradeIds = data?.upgradeIds;
    this.bonusCoins = data?.bonusCoins;
    this.isClaimed = data?.isClaimed;
    this.remainSeconds = data?.remainSeconds;
  }
}

class UpgradeForBuyResponse {
  constructor(data) {
    this.upgradesForBuy = new UpgradesForBuy(data.upgradesForBuy).upgrades;
    this.sections = data.sections;
    this.dailyCombo = new DailyCombo(data.dailyCombo);
  }
}

module.exports = {
  UpgradeForBuyResponse,
  UpgradeInListing,
  UpgradesForBuy,
};

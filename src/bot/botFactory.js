const { BotService } = require("./service/botService");
const log4js = require("log4js");
const { UpgradesStrategy } = require("./service/upgradesStrategy");

/**
 *
 * @param {String} token
 * @param {String} name
 * @returns BotService
 */
async function ExecuteBot(token, name = "") {
  const logger = log4js.getLogger(name || `BOT-${token.slice(0, 5)}`);

  const bot = new BotService(token, logger);

  await bot.meTelegram();
  await bot.config();
  await bot.sync();
  await bot.claimDailyCipher();
  await bot.claimTasks();

  const upgradesStrategy = new UpgradesStrategy(bot, logger);
  await upgradesStrategy.run();

  logger.info(
    `Starting ${bot.telegramData.fullName} - ${bot.clickerUser.availableTaps} totalEnergy - ${bot.clickerUser.balanceCoins} coins`
  );

  const taps = await bot.runOutEnergy(bot, logger);
  logger.info(
    `Finishing ${bot.telegramData.fullName} - ${taps} total energy consumed - ${bot.clickerUser.balanceCoins} coins`
  );

  return bot;
}

module.exports = {
  ExecuteBot,
};

const { BotService } = require("./service/bot");
const log4js = require("log4js");
const { UpgradesStrategy } = require("./service/upgradesStrategy");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *
 * @param {any} bot
 * @param {import("log4js").Logger} logger
 * @returns
 */
async function runOutTaps(bot, logger) {
  // should tap until availableTaps is 0, will do 24 by 24
  // in the case of 23 availableTaps, it will do 23 taps
  const savedTotalTaps = Number(bot.clickerUser.availableTaps);
  let taps = 0;
  const tapsPerClick = 5;
  const timeToWait = 2100;
  while (taps < bot.clickerUser.availableTaps) {
    logger.info(
      `Tapping ${tapsPerClick} times - ${taps} taps - ${bot.clickerUser.availableTaps} available taps - ${bot.clickerUser.balanceCoins} coins`
    );
    await bot.tap(tapsPerClick);
    taps += tapsPerClick;

    await sleep(timeToWait);
    if (taps > bot.clickerUser.availableTaps) {
      const diffTaps = taps - bot.clickerUser.availableTaps;
      await bot.tap(diffTaps);
      taps = bot.clickerUser.availableTaps;
    }
  }
  return savedTotalTaps;
}

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
    `Starting ${bot.telegramData.fullName} - ${bot.clickerUser.availableTaps} taps - ${bot.clickerUser.balanceCoins} coins`
  );

  const taps = await runOutTaps(bot, logger);
  logger.info(
    `Finishing ${bot.telegramData.fullName} - ${taps} taps - ${bot.clickerUser.balanceCoins} coins`
  );

  return bot;
}

module.exports = {
  ExecuteBot,
};

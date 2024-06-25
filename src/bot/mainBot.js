const { BotService } = require("./service/bot");
const log4js = require("log4js");
const { UpgradesStrategy } = require("./service/upgradesStrategy");

/**
 * Realiza uma pausa assíncrona.
 * @param {number} ms - Tempo em milissegundos para esperar.
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Realiza uma série de taps até que toda energia de tap seja consumida.
 * @param {BotService} bot - Serviço do bot.
 * @param {import("log4js").Logger} logger - Logger para registrar informações.
 * @returns {Promise<number>} - Total de energia consumida.
 */
async function runOutEnergy(bot, logger) {
  try {
    const savedTotalTaps = Number(bot.clickerUser.availableTaps);
    const energyConsumedByTap = Number(bot.clickerUser.earnPerTap);
    const quantityOfTaps = Number(process.env.QUANTITY_OF_TAPS || 4);
    const timeToWait = 2100;

    let totalEnergy = Number(bot.clickerUser.availableTaps);
    let totalCoinsEarned = 0;
    while (totalEnergy > 0) {
      const currentTaps = Math.min(
        Math.floor(totalEnergy / energyConsumedByTap),
        quantityOfTaps
      );

      if (currentTaps === 0) {
        logger.info("No more energy to tap");
        break;
      }
      await bot.tap(currentTaps);

      // Atualiza a quantidade de taps disponíveis após o tap
      totalEnergy -= currentTaps * energyConsumedByTap;
      totalCoinsEarned += currentTaps * energyConsumedByTap;

      logger.info(
        `Tapped ${currentTaps} times - ${energyConsumedByTap} earnPerTap - ${totalEnergy} available energy - ${totalCoinsEarned} coins earned`
      );
      // Pausa entre os taps
      await sleep(timeToWait);
    }

    return savedTotalTaps;
  } catch (error) {
    logger.error(
      "Error while running out energy",
      error?.response?.data || error.message
    );
  }
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
    `Starting ${bot.telegramData.fullName} - ${bot.clickerUser.availableTaps} totalEnergy - ${bot.clickerUser.balanceCoins} coins`
  );

  const taps = await runOutEnergy(bot, logger);
  logger.info(
    `Finishing ${bot.telegramData.fullName} - ${taps} total energy consumed - ${bot.clickerUser.balanceCoins} coins`
  );

  return bot;
}

module.exports = {
  ExecuteBot,
};

require("dotenv").config({ path: __dirname + "/.env" });
const log4js = require("log4js");
log4js.configure("./src/config/log4js.json");
const logger = log4js.getLogger("app");

const { ExecuteBot } = require("./src/bot/botFactory");
const { parseTokensFromEnv } = require("./src/utils/parseTokens");

async function main() {
  const token = parseTokensFromEnv()[0];
  if (!token) {
    logger.error("No token found");
    return;
  }

  await ExecuteBot(token);
}

main();

function parseTokensFromEnv() {
  if (typeof process.env.TOKENS === "string") {
    const tokens = process.env.TOKENS.split(",");
    return tokens;
  }

  return [];
}

module.exports = {
  parseTokensFromEnv,
};

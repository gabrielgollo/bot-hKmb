// DailyCipher
// "dailyCipher": {
//     "cipher": "RkF4STQ==",
//     "bonusCoins": 1000000,
//     "isClaimed": true,
//     "remainSeconds": 52240
// }

class DailyCipher {
  constructor(data) {
    this.cipher = data.cipher;
    this.bonusCoins = data.bonusCoins;
    this.isClaimed = data.isClaimed;
    this.remainSeconds = data.remainSeconds;
  }

  Decrypt() {
    const currCipher = this.cipher.slice(0, 3) + this.cipher.slice(4);
    return Buffer.from(currCipher, "base64").toString("ascii");
  }
}

module.exports = { DailyCipher };

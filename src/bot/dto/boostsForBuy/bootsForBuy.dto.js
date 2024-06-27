class Boosts {
  constructor(data) {
    this.id = data?.id;
    this.price = data?.price;
    this.earnPerTap = data?.earnPerTap;
    this.maxTaps = data?.maxTaps;
    this.cooldownSeconds = data?.cooldownSeconds;
    this.level = data?.level;
    this.maxTapsDelta = data?.maxTapsDelta;
    this.earnPerTapDelta = data?.earnPerTapDelta;
  }
}

class BoostsForBuyDto {
  constructor(data = []) {
    this.boostsForBuy = data.map((boost) => {
      return new Boosts(boost);
    });
  }
}

module.exports = {
  BoostsForBuyDto,
  Boosts,
};

// {
// 	"boostsForBuy": [
// 		{
// 			"id": "BoostEarnPerTap",
// 			"price": 2048000,
// 			"earnPerTap": 11,
// 			"maxTaps": 0,
// 			"cooldownSeconds": 0,
// 			"level": 11,
// 			"maxTapsDelta": 0,
// 			"earnPerTapDelta": 1
// 		},
// 		{
// 			"id": "BoostMaxTaps",
// 			"price": 4096000,
// 			"earnPerTap": 0,
// 			"maxTaps": 6000,
// 			"cooldownSeconds": 0,
// 			"level": 12,
// 			"maxTapsDelta": 500,
// 			"earnPerTapDelta": 0
// 		},
// 		{
// 			"id": "BoostFullAvailableTaps",
// 			"price": 0,
// 			"earnPerTap": 0,
// 			"maxTaps": 0,
// 			"maxLevel": 6,
// 			"cooldownSeconds": 2123,
// 			"level": 2,
// 			"maxTapsDelta": 0,
// 			"earnPerTapDelta": 0
// 		}
// 	]
// }

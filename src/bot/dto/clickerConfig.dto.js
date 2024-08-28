const { DailyCipher } = require("./dailyCipher.dto");

class ClickerConfig {
  constructor(config) {
    // this.guidLink = config.clickerConfig.guidLink;
    // this.maxPassiveDtSeconds = config.clickerConfig.maxPassiveDtSeconds;
    // this.userLevels_balanceCoins = config.clickerConfig.userLevels_balanceCoins;
    // this.boosts = config.clickerConfig.boosts;
    // this.tasks = config.clickerConfig.tasks;
    // this.airdropTasks = config.clickerConfig.airdropTasks;
    // this.levelUp = config.clickerConfig.levelUp;
    // this.referral = config.clickerConfig.referral;
    // this.exchanges = config.clickerConfig.exchanges;
    // this.airdrops = config.clickerConfig.airdrops;
    // this.depositsUpdateCooldownSeconds =
    //   config.clickerConfig.depositsUpdateCooldownSeconds;
    this.dailyCipher = new DailyCipher(config.dailyCipher);
    this.feature = config.feature;
  }
}

module.exports = { ClickerConfig };

// ClickerConfig
// {
// 	"clickerConfig": {
// 		"guidLink": {
// 			"ru": "https://hamster-kombat.notion.site/Hamster-Kombat-b14906aba45243c58c9f634ce1b38d1e",
// 			"en": "https://hamster-kombat.notion.site/Hamster-Kombat-manual-7e53c342eef143de8bc9c8262ea3a36d",
// 			"latam": "https://hamster-kombat.notion.site/Hamster-Kombat-manual-7e53c342eef143de8bc9c8262ea3a36d",
// 			"uz": "https://hamster-kombat.notion.site/Hamster-Kombat-manual-7e53c342eef143de8bc9c8262ea3a36d",
// 			"vn": "https://hamster-kombat.notion.site/Hamster-Kombat-manual-7e53c342eef143de8bc9c8262ea3a36d",
// 			"br": "https://hamster-kombat.notion.site/Hamster-Kombat-manual-7e53c342eef143de8bc9c8262ea3a36d"
// 		},
// 		"maxPassiveDtSeconds": 10800,
// 		"userLevels_balanceCoins": [
// 			{
// 				"level": 1,
// 				"coinsToLeveUp": 5000
// 			},
// 			{
// 				"level": 2,
// 				"coinsToLeveUp": 25000
// 			},
// 			{
// 				"level": 3,
// 				"coinsToLeveUp": 100000
// 			},
// 			{
// 				"level": 4,
// 				"coinsToLeveUp": 1000000
// 			},
// 			{
// 				"level": 5,
// 				"coinsToLeveUp": 2000000
// 			},
// 			{
// 				"level": 6,
// 				"coinsToLeveUp": 10000000
// 			},
// 			{
// 				"level": 7,
// 				"coinsToLeveUp": 50000000
// 			},
// 			{
// 				"level": 8,
// 				"coinsToLeveUp": 100000000
// 			},
// 			{
// 				"level": 9,
// 				"coinsToLeveUp": 1000000000
// 			},
// 			{
// 				"level": 10,
// 				"coinsToLeveUp": null
// 			}
// 		],
// 		"boosts": [
// 			{
// 				"id": "BoostEarnPerTap",
// 				"price": 2000,
// 				"earnPerTap": 1,
// 				"maxTaps": 0
// 			},
// 			{
// 				"id": "BoostMaxTaps",
// 				"price": 2000,
// 				"earnPerTap": 0,
// 				"maxTaps": 500
// 			},
// 			{
// 				"id": "BoostFullAvailableTaps",
// 				"price": 0,
// 				"earnPerTap": 0,
// 				"maxTaps": 0,
// 				"maxLevel": 6,
// 				"cooldownSeconds": 3600
// 			}
// 		],
// 		"tasks": [
// 			{
// 				"id": "hamster_youtube_academy_s1e6",
// 				"rewardCoins": 100000,
// 				"periodicity": "Once",
// 				"link": "https://www.youtube.com/watch?v=9WBuXdDGoRc"
// 			},
// 			{
// 				"id": "subscribe_telegram_channel",
// 				"rewardCoins": 5000,
// 				"periodicity": "Once",
// 				"link": "https://t.me/hamster_kombat",
// 				"channelId": -1002075341442
// 			},
// 			{
// 				"id": "subscribe_x_account",
// 				"rewardCoins": 5000,
// 				"periodicity": "Once",
// 				"link": "https://twitter.com/hamster_kombat"
// 			},
// 			{
// 				"id": "select_exchange",
// 				"rewardCoins": 5000,
// 				"periodicity": "Once"
// 			},
// 			{
// 				"id": "invite_friends",
// 				"rewardCoins": 25000,
// 				"periodicity": "Once"
// 			},
// 			{
// 				"id": "streak_days",
// 				"rewardCoins": 0,
// 				"periodicity": "Repeatedly",
// 				"rewardsByDays": [
// 					{
// 						"days": 1,
// 						"rewardCoins": 500
// 					},
// 					{
// 						"days": 2,
// 						"rewardCoins": 1000
// 					},
// 					{
// 						"days": 3,
// 						"rewardCoins": 2500
// 					},
// 					{
// 						"days": 4,
// 						"rewardCoins": 5000
// 					},
// 					{
// 						"days": 5,
// 						"rewardCoins": 15000
// 					},
// 					{
// 						"days": 6,
// 						"rewardCoins": 25000
// 					},
// 					{
// 						"days": 7,
// 						"rewardCoins": 100000
// 					},
// 					{
// 						"days": 8,
// 						"rewardCoins": 500000
// 					},
// 					{
// 						"days": 9,
// 						"rewardCoins": 1000000
// 					},
// 					{
// 						"days": 10,
// 						"rewardCoins": 5000000
// 					}
// 				]
// 			}
// 		],
// 		"airdropTasks": [
// 			{
// 				"id": "airdrop_connect_ton_wallet",
// 				"rewardTickets": 0,
// 				"periodicity": "Once"
// 			}
// 		],
// 		"levelUp": {
// 			"maxTaps": 500,
// 			"earnPerTap": 1
// 		},
// 		"referral": {
// 			"base": {
// 				"welcome": 5000,
// 				"levelUp": {
// 					"1": 0,
// 					"2": 20000,
// 					"3": 30000,
// 					"4": 40000,
// 					"5": 60000,
// 					"6": 100000,
// 					"7": 250000,
// 					"8": 500000,
// 					"9": 1000000,
// 					"10": 3000000
// 				}
// 			},
// 			"premium": {
// 				"welcome": 25000,
// 				"levelUp": {
// 					"1": 0,
// 					"2": 25000,
// 					"3": 50000,
// 					"4": 75000,
// 					"5": 100000,
// 					"6": 150000,
// 					"7": 500000,
// 					"8": 1000000,
// 					"9": 2000000,
// 					"10": 6000000
// 				}
// 			}
// 		},
// 		"exchanges": [
// 			{
// 				"id": "binance",
// 				"name": "Binance",
// 				"players": 150000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "bybit",
// 				"name": "Bybit",
// 				"players": 140000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "okx",
// 				"name": "OKX",
// 				"players": 130000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "bingx",
// 				"name": "BingX",
// 				"players": 130000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "htx",
// 				"name": "HTX",
// 				"players": 130000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "kucoin",
// 				"name": "Kucoin",
// 				"players": 130000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "gate_io",
// 				"name": "Gate.io",
// 				"players": 130000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "mexc",
// 				"name": "MEXC",
// 				"players": 130000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "bitget",
// 				"name": "Bitget",
// 				"players": 130000,
// 				"bonus": 100
// 			},
// 			{
// 				"id": "hamster",
// 				"name": "Hamster",
// 				"players": 130000,
// 				"bonus": 100
// 			}
// 		],
// 		"airdrops": [],
// 		"depositsUpdateCooldownSeconds": 60
// 	},
// 	"dailyCipher": {
// 		"cipher": "RkF4STQ==",
// 		"bonusCoins": 1000000,
// 		"isClaimed": true,
// 		"remainSeconds": 52240
// 	},
// 	"feature": [
// 		"airdrop_connect_ton_wallet"
// 	]
// }

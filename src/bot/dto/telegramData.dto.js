class TelegramData {
  constructor(data) {
    this.id = data.id;
    this.isBot = data.isBot;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.languageCode = data.languageCode;
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}

module.exports = { TelegramData };

// {
// 	"telegramUser": {
// 		"id": 7443583043,
// 		"isBot": false,
// 		"firstName": "Gabriel",
// 		"lastName": "Gollo",
// 		"languageCode": "pt-br"
// 	},
// 	"status": "Ok"
// }

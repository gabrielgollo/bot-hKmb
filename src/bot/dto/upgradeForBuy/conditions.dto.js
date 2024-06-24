class Condition {
  constructor(data) {
    if (data) {
      this.type = data._type;
    } else {
      this.type = null;
    }
  }
}

class ByUpgradeCondition extends Condition {
  constructor(data) {
    super(data);
    this.upgradeId = data.upgradeId;
    this.level = data.level;
  }
}

class ReferralCountCondition extends Condition {
  constructor(data) {
    super(data);
    this.referralCount = data.referralCount;
  }
}

class MoreReferralsCountCondition extends Condition {
  constructor(data) {
    super(data);
    this.moreReferralsCount = data.moreReferralsCount;
  }
}

class SubscribeTelegramChannelCondition extends Condition {
  constructor(data) {
    super(data);
    this.link = data.link;
    this.channelId = data.channelId;
  }
}

class LinkWithoutCheckCondition extends Condition {
  constructor(data) {
    super(data);
    this.link = data.link;
  }
}

class LinksToUpgradeLevelCondition extends Condition {
  constructor(data) {
    super(data);
    this.subscribeLink = data.subscribeLink;
    this.links = data.links;
  }
}

class ConditionFactory {
  /**
   * Creates a specific condition instance based on the data type.
   * @param {Object} data - The data for the condition.
   * @returns {Condition}
   */
  static create(data) {
    switch (data?._type) {
      case "ByUpgrade":
        return new ByUpgradeCondition(data);
      case "ReferralCount":
        return new ReferralCountCondition(data);
      case "MoreReferralsCount":
        return new MoreReferralsCountCondition(data);
      case "SubscribeTelegramChannel":
        return new SubscribeTelegramChannelCondition(data);
      case "LinkWithoutCheck":
        return new LinkWithoutCheckCondition(data);
      case "LinksToUpgradeLevel":
        return new LinksToUpgradeLevelCondition(data);
      default:
        return new Condition(data);
    }
  }
}

module.exports = {
  ConditionFactory,
};

// some has
// "condition": {
//     "_type": "ByUpgrade",
//     "upgradeId": "x",
//     "level": 5
// },

// some has
// "condition": {
//     "_type": "ReferralCount",
//     "referralCount": 2
// },

// some has
// "condition": {
//     "_type": "MoreReferralsCount",
//     "moreReferralsCount": 1
// },

// some has
// "condition": {
//     "_type": "SubscribeTelegramChannel",
//     "link": "https://t.me/+kK14mIuJR2hlMmNi",
//     "channelId": -1002075341442
// },

// some has
// "condition": {
//     "_type": "LinkWithoutCheck",
//     "link": "http://twitter.com/hamster_kombat"
// },

// some has
// "condition": {
//     "_type": "LinksToUpgradeLevel",
//     "subscribeLink": "https://www.youtube.com/@HamsterKombat_Official?sub_confirmation=1",
//     "links": [
//         "https://www.youtube.com/shorts/FW-GpTr-FcU",
//         "https://www.youtube.com/shorts/a_gHYwMsjh0",
//         "https://www.youtube.com/shorts/bISprviSSxg",
//         "https://www.youtube.com/shorts/S9_T6LokFNc",
//         "https://www.youtube.com/shorts/uefHXh7Dvms",
//         "https://www.youtube.com/shorts/825u1acydv4"
//     ]
// },

// some has
// "condition": null

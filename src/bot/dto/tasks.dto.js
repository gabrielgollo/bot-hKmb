class Task {
  constructor(tasks) {
    this.id = tasks.id;
    this.rewardCoins = tasks.rewardCoins;
    this.periodicity = tasks.periodicity;
    this.link = tasks?.link;
    this.isCompleted = tasks.isCompleted || false;
    this.completedAt = tasks?.completedAt || null;
    this.rewardsByDays = tasks?.rewardsByDays || null;
    this.days = tasks?.days || null;
    this.remainSeconds = tasks.remainSeconds || null;
  }
}

class Tasks {
  constructor(tasks = []) {
    this.tasks = tasks.map((task) => new Task(task));
  }

  /**
   * @param {string} taskId
   * @returns {Task}
   * @description Get task by id
   *
   */
  getTaskById(taskId) {
    return this.tasks.find((task) => task.id === taskId);
  }

  /**
   * @returns {Task[]}
   */
  getTasks() {
    return this.tasks;
  }

  /**
   * @returns {Task[]}
   */
  getNotCompletedTasks() {
    return this.tasks.filter(
      (task) =>
        !task.isCompleted &&
        task.id !== "streak_days" &&
        task.id !== "invite_friends"
    );
  }

  getStreakDaysTask() {
    return this.tasks.find((task) => task.id === "streak_days");
  }
}

module.exports = {
  Tasks,
};

// {
// 	"tasks": [
// 		{
// 			"id": "hamster_youtube_easy_start_s1e5",
// 			"rewardCoins": 100000,
// 			"periodicity": "Once",
// 			"link": "https://youtu.be/a7LQcJQWraU",
// 			"isCompleted": false
// 		},
// 		{
// 			"id": "hamster_youtube_academy_s1e6",
// 			"rewardCoins": 100000,
// 			"periodicity": "Once",
// 			"link": "https://www.youtube.com/watch?v=9WBuXdDGoRc",
// 			"isCompleted": false
// 		},
// 		{
// 			"id": "subscribe_telegram_channel",
// 			"rewardCoins": 5000,
// 			"periodicity": "Once",
// 			"link": "https://t.me/hamster_kombat",
// 			"channelId": -1002075341442,
// 			"isCompleted": true,
// 			"completedAt": "2024-06-17T15:07:53.419Z"
// 		},
// 		{
// 			"id": "subscribe_x_account",
// 			"rewardCoins": 5000,
// 			"periodicity": "Once",
// 			"link": "https://twitter.com/hamster_kombat",
// 			"isCompleted": false
// 		},
// 		{
// 			"id": "select_exchange",
// 			"rewardCoins": 5000,
// 			"periodicity": "Once",
// 			"isCompleted": true,
// 			"completedAt": "2024-06-17T15:08:09.414Z"
// 		},
// 		{
// 			"id": "invite_friends",
// 			"rewardCoins": 25000,
// 			"periodicity": "Once",
// 			"isCompleted": false
// 		},
// 		{
// 			"id": "streak_days",
// 			"rewardCoins": 500,
// 			"periodicity": "Repeatedly",
// 			"rewardsByDays": [
// 				{
// 					"days": 1,
// 					"rewardCoins": 500
// 				},
// 				{
// 					"days": 2,
// 					"rewardCoins": 1000
// 				},
// 				{
// 					"days": 3,
// 					"rewardCoins": 2500
// 				},
// 				{
// 					"days": 4,
// 					"rewardCoins": 5000
// 				},
// 				{
// 					"days": 5,
// 					"rewardCoins": 15000
// 				},
// 				{
// 					"days": 6,
// 					"rewardCoins": 25000
// 				},
// 				{
// 					"days": 7,
// 					"rewardCoins": 100000
// 				},
// 				{
// 					"days": 8,
// 					"rewardCoins": 500000
// 				},
// 				{
// 					"days": 9,
// 					"rewardCoins": 1000000
// 				},
// 				{
// 					"days": 10,
// 					"rewardCoins": 5000000
// 				}
// 			],
// 			"days": 1,
// 			"isCompleted": false,
// 			"remainSeconds": 32714
// 		}
// 	]
// }

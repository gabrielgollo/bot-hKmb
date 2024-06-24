# Bot

This bot will claim the rewards of the accounts that you have in the environment variables.

# Requirements

- Node.js 20.15.0
- Configure your environment variables in a '.env' in the root of app (contact me for more infos)
  - Vars needed:
    - TOKENS -> supports multiple account separated by ','.
    - APIURL -> hKmb api
    - SCHEDULER_CRON_TIME -> "0/5 * * * *" <- for exec each 5 minutes 

# How to Use?

First you need to install Node.js 20.15.0

Then you need to open your terminal in the root of the application and install the project with:

|  npm install

And then you should configure your environment variables in a '.env' in the root of app (contact me for more infos)

After that you can run the project with:

|  npm start
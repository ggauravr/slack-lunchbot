# slack-lunchbot
Lunchbot with NodeJS and Firebase

## Running the app

```npm install```

### Development

Build and watch
```
npm run dev
```

Running the app
```
node build/app
```

Minified
```
npm run dist
```


## Settings

Create a ```.env``` for API keys/ Token

| Variable | Comments |
|---------|-----------|
|```SLACK_INCOMING_WEBHOOK```| Slack incoming webhook URL _e.g.https://hooks.slack.com/services/xxx/yyy/zzz_|
|```SLACK_BOT_TOKEN```|Slack bot integration token|
|```CLEVERBOT_API_USER```| Cleverbot API user (register at [cleverbot.io](http://cleverbot.io))|
|```CLEVERBOT_API_KEY```| Cleverbot API key|
|```FIREBASE_API```| Firebase credentials, JSON file _e.g ./firebaseapp.json_|
|```FIREBASE_DB```|Firebase database URL _e.g myapp.firebaseio.com_|

Slack and schedule configuration is in ```src/config/index.js```
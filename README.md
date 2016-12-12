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

Create a ```.env``` for API keys/ token

Variables from Firebase _FB_ prefixes are Firebase permissions JSON credentials

| Variable | Comments |
|---------|-----------|
|```SLACK_INCOMING_WEBHOOK```| Slack incoming webhook URL _e.g.https://hooks.slack.com/services/xxx/yyy/zzz_|
|```SLACK_BOT_TOKEN```|Slack bot integration token|
|```CLEVERBOT_API_USER```| Cleverbot API user (register at [cleverbot.io](http://cleverbot.io))|
|```CLEVERBOT_API_KEY```| Cleverbot API key|
|```FB_TYPE```| type |
|```FB_PROJECTID```| Project ID|
|```FB_PRIVATEKEY_ID```| Private key ID|
|```FB_PRIVATEKEY```| Private key|
|```FB_CLIENT_EMAIL```|client email |
|```FB_CLIENT_ID```|client id |
|```FB_AUTH_URI```| auth uri|
|```FB_TOKEN_URI```| token uri|
|```FB_AUTH_PROVIDER```| auth provider cert url|
|```FB_CLIENT_CERT```| client cert url |
|```FIREBASE_DB```|Firebase database URL _e.g myapp.firebaseio.com_|

Slack and schedule configuration is in ```src/config/index.js```
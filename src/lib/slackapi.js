'use strict';
import config from '../config';
import Slack from 'slack-node';
import sha1 from 'sha1';

let slack = new Slack();
slack.setWebhook(config.slack.incomingURL);

let sendMessage = (msg) =>{
    slack.webhook({
    channel: config.slack.channel,
    username: config.slack.username,
    icon_emoji: config.slack.iconemoji,
    text: msg
    }, function(err, response) {
        console.log(response);
    });
}

export default sendMessage;

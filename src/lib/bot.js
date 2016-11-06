'use strict';
import Botkit from 'botkit';
import Cleverbot from 'cleverbot.io';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') dotenv.config();

class Bot{
    constructor (config){
        this.config = config;
        this.cleverbot = new Cleverbot(process.env.CLEVERBOT_API_USER, process.env.CLEVERBOT_API_KEY);
        this.cleverbot.setNick('LunchBot'); 
        this.cleverbot.create(function (err, session) {  
            if (err) {
                console.log('cleverbot create fail.');
            } else {
                console.log('cleverbot create success.');
            }
        });

        this.controller = Botkit.slackbot({
            debug: false
        });

        this.controller.spawn({
            token: process.env.SLACK_BOT_TOKEN
        }).startRTM();

        this.botWebhook = this.controller.spawn({
            incoming_webhook: {
                url: process.env.SLACK_INCOMING_WEBHOOK
            }
        })
    };

    sendIncomingWebhook(msg){
        let _self = this;
        this.botWebhook.sendWebhook({
            username: _self.config.slack.username,
            icon_emoji: _self.config.slack.iconemoji,
            channel: _self.config.slack.channel,
            text: msg
        },function(err,res) {
            if (err) {
                console.log('sendWebhook error');
            }
        });
    }

    getUserInfo(bot, message,cb){
        bot.api.users.info({user: message.user}, (error, response) => {
            cb(response.user);
        })
    }

    getChannelInfo(bot, message,cb){
        bot.api.channels.info({channel: message.channel}, (error, response) => {
            cb(response.channel);
        })
    }

    cleverBotResponse(bot, message){
        let msg = message.text;
         this.cleverbot.ask(msg, function (err, response) {
            if (!err) {
                bot.reply(message, response);
            } else {
                console.log('cleverbot err: ' + err);
            }
        });
    };
}

export default Bot;
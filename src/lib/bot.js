'use strict';
import Botkit from 'botkit';
import Cleverbot from 'cleverbot.io';

class Bot{
    constructor (config){
        this.config = config;
        this.cleverbot = new Cleverbot(this.config.cleverbot.apiuser, this.config.cleverbot.apikey);
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
            token: this.config.lunchbot.apitoken
        }).startRTM();

        this.botWebhook = this.controller.spawn({
            incoming_webhook: {
                url: this.config.slack.incomingwebhook
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

    getUserName(bot, message,cb){
        bot.api.users.info({user: message.user}, (error, response) => {
            let {name} = response.user;
            cb(name);
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
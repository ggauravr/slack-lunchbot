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
            token: this.config.lunchbot.apitoken,
        }).startRTM();

    }

    setHelpWelcomeMessage(bot, message){
        let _self = this;
        bot.api.users.info({user: message.user}, (error, response) => {
            let {name} = response.user;
            bot.reply(message, `Hi @${name} :wave:\n\n Welcome to the ${_self.config.slack.channel} channel. You can ask me for lunch suggestions. \n Here are some commands you can start with: \n @${_self.config.slack.username} suggest lunch \n @${_self.config.slack.username} suggest dinner \n\n Also at ${_self.config.schedule.text}, I will suggest a random venue for lunch. \n\nTo see this message again, type @${_self.config.slack.username} help`);
        })
    }

    getCleverBot(){
        return this.cleverbot;
    }
}

export default Bot;
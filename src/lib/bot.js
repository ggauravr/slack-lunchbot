'use strict';
import Botkit from 'botkit';
import Cleverbot from 'cleverbot.io';

class Bot{
    constructor (config, store){
        this.config = config;
        this.store = store;

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

        this.setListeners();
    }

    setHelpWelcomeMessage(bot, message){
        let _self = this;
        bot.api.users.info({user: message.user}, (error, response) => {
            let {name} = response.user;
            bot.reply(message, `Hi @${name} :wave:\n\n Welcome to the ${_self.config.slack.channel} channel. You can ask me for lunch suggestions. \n Here are some commands you can start with: \n @${_self.config.slack.username} suggest lunch \n @${_self.config.slack.username} suggest dinner \n\n Also at ${_self.config.schedule.text}, I will suggest a random venue for lunch. \n\nTo see this message again, type @${_self.config.slack.username} help`);
        })
    }

    setListeners(){

        let _self = this;

        //Listens for keywords
        this.controller.hears('suggest (.*)',['direct_message','direct_mention','mention'],function(bot,message) {
            let mealType = message.match[1];
            switch (mealType){
                case 'breakfast':
                    _self.store.getRandomLunchVenue('breakfast');
                    break;
                case 'lunch':
                    _self.store.getRandomLunchVenue('lunch');
                    break;
                case 'dinner':
                    _self.store.getRandomLunchVenue('dinner');
                    break;
                default:
                    bot.reply(message, 'Hmm, not sure what you meant. I can suggest breakfast, lunch or dinner though');
                    break;
            }
        });

        this.controller.hears('list (.*)',['direct_message','direct_mention','mention'],function(bot,message) {
            let restriction = message.match[1];
            switch (restriction){
                case 'breakfast':
                    
                    break;
                case 'lunch':
                    
                    break;
                case 'dinner':
                    
                    break;
                default:
                    //List all
                    _self.store.getList();
                    break;
            }
        });

        this.controller.hears(['hello', 'hi', ':wave:', 'hola', 'you there'],['direct_message','direct_mention','mention'],function(bot,message) {
            bot.api.users.info({user: message.user}, (error, response) => {
                let {name, real_name} = response.user;
                bot.reply(message, `Hi @${name}`);
            })
        });

        this.controller.hears(['help', 'intro'],['direct_message','direct_mention','mention'],function(bot,message) {
            _self.setHelpWelcomeMessage(bot,message);
        });

        //Listens for RTM events
        this.controller.on('user_channel_join', function(bot, message) {
            _self.setHelpWelcomeMessage(bot,message);
        });


        //Making non meal related conversations
        this.controller.on(['direct_message','mention','direct_mention'],function(bot,message) {
            bot.reply(message,'Yes Boss? :smiley:');
        });

        this.controller.hears('',['direct_message','direct_mention','mention'],function(bot,message) {  
            var msg = message.text;
            if (msg.length){
                _self.cleverbot.ask(msg, function (err, response) {
                    if (!err) {
                        bot.reply(message, response);
                    } else {
                        console.log('cleverbot err: ' + err);
                    }
                });
            }
        })
    }
}

export default Bot;
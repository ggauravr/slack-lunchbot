'use strict';
import config from './config';
import Bot from './lib/bot';
//import setSchedule from './lib/schedule';
import Store from './lib/store';

let store = new Store(config.firebase);
let slackbot = new Bot(config);
const AVAILABILITY = ['breakfast','lunch','dinner'];

//Listens for keywords
slackbot.controller.hears(['suggest (.*)', 'suggest'],['direct_message','direct_mention','mention'],function(bot,message) {
    let mealType = message.match[1];
    let restriction = (AVAILABILITY.indexOf(mealType) < 0) ? 'all' : mealType;
    let suggestion = store.getRandomLunchVenue(restriction);
    bot.reply(message, `Let's go to :knife_fork_plate: *${suggestion.title}* !`);
});

slackbot.controller.hears(['list (.*)', 'list', 'list all'],['direct_message','direct_mention','mention'],function(bot,message) {
    let mealType = message.match[1];
    let restriction = (AVAILABILITY.indexOf(mealType) < 0) ? 'all' : mealType;
    let list = store.getVenueList(restriction);
    //bot.reply(message, `Let's go to :knife_fork_plate: *${suggestion.title}* !`);
});


slackbot.controller.hears(['help', 'intro'],['direct_message','direct_mention','mention'],function(bot,message) {
    let user = new Promise((resolve,reject) => slackbot.getUserName(bot,message,resolve));
    user.then((name)=>{
        var txt = `Hi @${name} :wave:\n\n Welcome to the ${config.slack.channel} channel. You can ask me for lunch suggestions. \n Here are some commands you can start with: \n @${config.slack.username} suggest lunch \n @${config.slack.username} suggest dinner \n\n Also at ${config.schedule.text}, I will suggest a random venue for lunch. \n\nTo see this message again, type @${config.slack.username} help`;
        bot.reply(message, txt);
    })
});

//Listens for RTM events
slackbot.controller.on('user_channel_join', function(bot, message) {
    let user = new Promise((resolve,reject) => slackbot.getUserName(bot,message,resolve));
    user.then((name)=>{
        var txt = `Hi @${name} :wave:, welcome to the ${config.slack.channel} channel`;
        bot.reply(message, txt);
    })
});


//Making non meal related conversations
slackbot.controller.hears('',['direct_message','direct_mention','mention'],function(bot,message) {  
    let msg = message.text;
    if (msg.length) {
       slackbot.cleverBotResponse(bot,message);
    }
});
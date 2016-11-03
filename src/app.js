'use strict';
import config from './config';
import Bot from './lib/bot';
//import setSchedule from './lib/schedule';
import Store from './lib/store';

let store = new Store(config.firebase);
let slackbot = new Bot(config);

//Listens for keywords
slackbot.controller.hears('suggest (.*)',['direct_message','direct_mention','mention'],function(bot,message) {
    let mealType = message.match[1];
    switch (mealType){
        case 'breakfast':
            store.getRandomLunchVenue('breakfast');
            break;
        case 'lunch':
            store.getRandomLunchVenue('lunch');
            break;
        case 'dinner':
            store.getRandomLunchVenue('dinner');
            break;
        default:
            bot.reply(message, 'Hmm, not sure what you meant. I can suggest breakfast, lunch or dinner though');
            break;
    }
});

slackbot.controller.hears(['list (.*)', 'list', 'list all'],['direct_message','direct_mention','mention'],function(bot,message) {
    let restriction = message.match[1];
    switch (restriction){
        case 'breakfast':
            
            break;
        case 'lunch':
            
            break;
        case 'dinner':
            
            break;
        case 'all':
            
            break;    
        default:
            //List all
            console.log(store.getList());
            break;
    }
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
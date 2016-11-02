'use strict';
import config from './config';
import Bot from './lib/bot';
//import setSchedule from './lib/schedule';
import Store from './lib/store';

let store = new Store(config.firebase);
let bot = new Bot(config, store);

//Listens for keywords
bot.controller.hears('suggest (.*)',['direct_message','direct_mention','mention'],function(bot,message) {
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

bot.controller.hears('list (.*)',['direct_message','direct_mention','mention'],function(bot,message) {
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
            console.log(store.getList());
            break;
    }
});

bot.controller.hears(['hello', 'hi', ':wave:', 'hola', 'you there'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
        bot.reply(message, `Hi @${name} :wave:`);
    })
});

bot.controller.hears(['help', 'intro'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.setHelpWelcomeMessage(bot,message);
});

//Listens for RTM events
bot.controller.on('user_channel_join', function(bot, message) {
    bot.setHelpWelcomeMessage(bot,message);
});


//Making non meal related conversations
bot.controller.on(['direct_message','mention','direct_mention'],function(bot,message) {
    bot.reply(message,'Yes Boss? :smiley:');
});

bot.controller.hears('',['direct_message','direct_mention','mention'],function(bot,message) {  
    var msg = message.text;
    if (msg.length){
        var cleverbot = bot.getCleverBot();
        cleverbot.ask(msg, function (err, response) {
            if (!err) {
                bot.reply(message, response);
            } else {
                console.log('cleverbot err: ' + err);
            }
        });
    }
});
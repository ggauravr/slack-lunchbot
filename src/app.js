'use strict';
import config from './config';
import Bot from './lib/bot';
import Store from './lib/store';
import express from 'express';
import dotenv from 'dotenv';
import Schedule from 'node-schedule';
import {forEach} from 'lodash';

if (process.env.NODE_ENV !== 'production') dotenv.config({ silent: process.env.NODE_ENV === 'production' });

let store = new Store();
let slackbot = new Bot(config);
const AVAILABILITY = ['breakfast','lunch','dinner'];

let app = express();
app.set('port', process.env.PORT || 5000)
app.get('/', function (req, res) {
  res.send('Nothing to see here');
})

app.listen(app.get('port'), function () {
  console.log('Express listening to port 3000');
})

//Listens for keywords
slackbot.controller.hears(['suggest (.*)', 'suggest'],['direct_message','direct_mention','mention'],function(bot,message) {
    let mealType = typeof (message.match[1] === 'undefined') ? message.match[1] :message.match[1].toLowerCase();
    let restriction = (AVAILABILITY.indexOf(mealType) < 0) ? 'all' : mealType;
    let suggestion = store.getRandomLunchVenue(restriction);
    let emoji = config.slack.emoji[Math.floor(Math.random() * (config.slack.emoji.length - 1))];
    bot.reply(message, `Let's go to ${emoji} *${suggestion.title}* !`);
});

slackbot.controller.hears(['list (.*)', 'list', 'list all'],['direct_message','direct_mention','mention'],function(bot,message) {
    let mealType = typeof (message.match[1] === 'undefined') ? message.match[1] :message.match[1].toLowerCase();
    let restriction = (AVAILABILITY.indexOf(mealType) < 0) ? 'all' : mealType;
    let list = store.getVenueList(restriction);
    let txt = '';
    let index = 0;
    forEach(list, (v,k)=> txt += `${++index}. ${v.title} \n`);
    bot.reply(message, `Here you are:\n\n ${txt} \n`);
});


slackbot.controller.hears(['help', 'intro'],['direct_message','direct_mention','mention'],function(bot,message) {
    let user = new Promise((resolve,reject) => slackbot.getUserInfo(bot,message,resolve));
    let channel = new Promise((resolve,reject) => slackbot.getChannelInfo(bot,message,resolve));

    Promise.all([user, channel]).then((val)=>{
        let {name} = val[0];
        let channelname = val[1].name;
        var txt = `Hi @${name} :wave:\n\n Welcome to the #${channelname} channel. You can ask me for a lunch (breakfast or dinner) suggestion. \n Here are some commands you can start with: \n \`\`\`@${config.slack.username} suggest\n@${config.slack.username} suggest dinner\n@${config.slack.username} list \`\`\`\n\n Also at ${config.scheduler.text}, I will suggest a random venue for lunch. \n\n`;
        bot.reply(message, txt);
    })
});

//Listens for RTM events
slackbot.controller.on('user_channel_join', function(bot, message) {
    let user = new Promise((resolve,reject) => slackbot.getUserInfo(bot,message,resolve));
    let channel = new Promise((resolve,reject) => slackbot.getChannelInfo(bot,message,resolve));

    Promise.all([user, channel]).then((val)=>{
        let {name} = val[0];
        let channelname = val[1].name;
        if (config.slack.channel.indexOf(channelname)>=0){
            var txt = `Hi @${name} :wave:\n\nWelcome to the ${config.slack.channel} channel! Type \`@${config.slack.username} help\` for info.`;
            bot.reply(message, txt);
        }
    })
});

//Making non meal related conversations
slackbot.controller.hears('',['direct_message','direct_mention','mention'],function(bot,message) {
    let msg = message.text;
    if (msg.length) {
       slackbot.cleverBotResponse(bot,message);
    }
});

//Schedule
let announcement = Schedule.scheduleJob(config.scheduler.schedule, function(){
    let suggestion = store.getRandomLunchVenue('all');
    let emoji = config.slack.emoji[Math.floor(Math.random() * (config.slack.emoji.length - 1))];
    let txt = `Lunch time, peeps. Let's go to ${emoji} *${suggestion.title}* ! :smile:`; 
    slackbot.sendIncomingWebhook(txt);
});

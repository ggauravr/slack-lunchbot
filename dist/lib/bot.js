'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _botkit=require('botkit');var _botkit2=_interopRequireDefault(_botkit);var _cleverbot=require('cleverbot.io');var _cleverbot2=_interopRequireDefault(_cleverbot);var _dotenv=require('dotenv');var _dotenv2=_interopRequireDefault(_dotenv);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}if(process.env.NODE_ENV!=='production')_dotenv2.default.config({silent:process.env.NODE_ENV==='production'});var Bot=function(){function Bot(config){_classCallCheck(this,Bot);this.config=config;this.cleverbot=new _cleverbot2.default(process.env.CLEVERBOT_API_USER,process.env.CLEVERBOT_API_KEY);this.cleverbot.setNick('LunchBot');this.cleverbot.create(function(err,session){if(err){console.log('cleverbot create fail.')}else{console.log('cleverbot create success.')}});this.controller=_botkit2.default.slackbot({debug:false});this.controller.spawn({token:process.env.SLACK_BOT_TOKEN}).startRTM();this.botWebhook=this.controller.spawn({incoming_webhook:{url:process.env.SLACK_INCOMING_WEBHOOK}})}_createClass(Bot,[{key:'sendIncomingWebhook',value:function sendIncomingWebhook(msg){var _self=this;this.botWebhook.sendWebhook({username:_self.config.slack.username,icon_emoji:_self.config.slack.iconemoji,channel:_self.config.slack.channel,text:msg},function(err,res){if(err){console.log('sendWebhook error')}})}},{key:'getUserInfo',value:function getUserInfo(bot,message,cb){bot.api.users.info({user:message.user},function(error,response){cb(response.user)})}},{key:'getChannelInfo',value:function getChannelInfo(bot,message,cb){bot.api.channels.info({channel:message.channel},function(error,response){cb(response.channel)})}},{key:'cleverBotResponse',value:function cleverBotResponse(bot,message){var msg=message.text;this.cleverbot.ask(msg,function(err,response){if(!err){bot.reply(message,response)}else{console.log('cleverbot err: '+err)}})}}]);return Bot}();exports.default=Bot;
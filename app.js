var telegramBot = require('node-telegram-bot-api');
var Sentiment = require('sentiment');
require('dotenv').config()
var sentiment=new Sentiment()
var token =process.env.TOKEN;
try{
var api = new telegramBot(token, {polling: true});
}catch(e){
    console.log(e)
    throw "error"
}

api.onText(/\/help/, function(msg, match) {
var fromId = msg.from.id;
api.sendMessage(fromId, "I can help you in getting the sentiments of any text you send to me.");
});

api.onText(/\/start/, function(msg, match) {
var fromId = msg.from.id;
api.sendMessage(fromId, "They call me SentimentBot. "
+
"I can help you in getting the sentiments of any text you send to me."+"To help you i just have few commands.\n/help\n/start\n/sentiments");
});
api.on("polling_error", (err) => {
    console.log(err)
    api.off()});
// api.on("error",(err)=>console.log())
console.log("Sentiment Bot has started has started. Start conversations in your Telegram.");
var opts = {
    reply_markup: JSON.stringify(
    {
    force_reply: true
    }
    )};
//sentiment command execution is added here
api.onText(/\/sentiments/, function(msg, match) {
    var fromId = msg.from.id;
    api.sendMessage(fromId, "Alright! So you need sentiments of a text from me. "+
    "I can help you in that. Just send me the text.", opts)
    .then(function (sended) {
    var chatId = sended.chat.id;
    var messageId = sended.message_id;
    api.onReplyToMessage(chatId, messageId, function (message) {
    //call a function to get sentiments here...
    var sentival = sentiment.analyze(message.text);
    api.sendMessage(fromId,"So sentiments for your text are, Score:" + sentival.score +" Comparative:").then((res)=>{
        console.log("response Succssful",res)
    }).catch((e)=>{
        console.log("Error in sending response",e)
    });
    });
    });
    });
    
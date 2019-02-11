var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var date_time = require('date-and-time');
var Client = require('node-rest-client').Client;
var client = new Client();
var moment = require('moment');
const roundTo = require('round-to');
var base64 = require('base-64');
var apiai = require('apiai');
var randomInt = require('random-int');

var congifURL = "<HEROKU_APP_URL>";
//var dotenv = require('dotenv').config()

var dialogFlow = apiai("<DIALOGFLOW_TOKEN>");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen((process.env.PORT || 3000));

var combos;

var status;
var PAGE_ACCESS_TOKEN = '<PAGE_ACCESS_TOKEN>'

const sessions = {};

const findOrCreateSession = (fbid) => {
    let sessionId;
    Object.keys(sessions).forEach(k => {
        if (sessions[k].fbid === fbid) {

            sessionId = k;
        }
    });
    if (!sessionId) {
        sessionId = new Date().toISOString();

        sessions[sessionId] = {
            fbid: fbid,
            Name: {},
            context: {},
            Email: {},
            academicArea: 0,
        };

    }
    // console.log("SESSION ID : " + sessionId)
    return sessionId;
};


app.get('/', function (req, res) {
    res.send('Hello world, Bot is Active.')
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === '<YOUT_RANDOM_TOKEN>') {
        res.send(req.query['hub.challenge']);

    } else {
        res.send('Invalid verify token');
    }
});



app.post('/webhook', function (req, res) {
    var data = req.body;

    if (data.object == 'page') {
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
            if (pageEntry.messaging != null) {
                pageEntry.messaging.forEach(function (messagingEvent) {
                    var senderID = messagingEvent.sender.id;

                    if (messagingEvent.message)
                        receivedMessage(messagingEvent);
                    else if (messagingEvent.postback)
                        receivedPostback(messagingEvent);
                    else
                        console.log("Webhook received unknown messagingEvent: ");
                });
            }
        });
        res.sendStatus(200);
    }
});

function receivedPostback(event) {
    var senderID = event.sender.id;
    //var recipientID = event.recipient.id;
    const sessionId = findOrCreateSession(senderID);
    var timeOfPostback = event.timestamp;

    if (event.postback.payload)
        payload_value = event.postback.payload
    switch (payload_value.split('|')[0]) {
        case 'hobbies':
            sendTextMessage(senderID, "Code Code Code!! \n\nHaha I am just Kidding. I looooovve Swimming 🏊🏻 and Skating ⛸️ \n\nWhat are your hobbies?");

            break;
        case 'fun':
            sendGifMessage(senderID, "winking_dean");
            setTimeout(function () {
                sendFun(senderID);
            }, 3500)
            break;

        case 'GET_STARTED_PAYLOAD':
            user_name(senderID);
            setTimeout(function () {
                sendStartingMessage(senderID)
            }, 1000)
            break;

        case 'restartBot':
            restart_Bot(senderID)
            break;
        case 'aboutme':
            sendTextMessage(senderID, "Hello world! I am 23 year old Software Developer. There is nothing much to tell about myself :P \n\nMy Instagram Profile👇 \nhttps://www.instagram.com/mayankkgandhi/ \n\nThis is a simple Chatbot which I have built and it will be updated time to time.. \n\n Just interact and have fun! :D ");
            setTimeout(function () {
                sendStartingMessage(senderID)
            }, 1500)
            break;
        case 'contactus':
            sendTextMessage(senderID, "For any queries you can mail me at mayank.k.gandhi@gmail.com . \nThanks!");
            break;
        default:
            console.log("===============================================Received Unknow ===========================================");

    }

};

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var message = event.message;
    var messageText = message.text;
    var knownMessage = true;
    var quickReplyMessage = false;
    var messageAttachments = message.attachments;
    var sticker = message.sticker_id;

    if (message.quick_reply) {
        if (message.quick_reply.payload) {
            quickReplyMessage = true;
            switch (message.quick_reply.payload.split('|')[0]) {
                case 'aboutme':
                    sendTextMessage(senderID, "Hello world! I am 23 year old Software Developer. There is nothing much to tell about myself :P \n\nMy Instagram Profile👇 \nhttps://www.instagram.com/mayankkgandhi/ \n\nThis is a simple Chatbot which I have built and it will be updated time to time.. \n\n Just interact and have fun! :D ");
                    setTimeout(function () {
                        sendStartingMessage(senderID)
                    }, 1500)
                    break;
                case 'fun':
                    if (message.quick_reply.payload.split('|')[1] == "meme") {
                        var favorites = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12];
                        var favorite = favorites[Math.floor(Math.random() * favorites.length)];
                        Image(senderID, favorite + ".jpg")
                        setTimeout(function () {
                            continueAfterfun(senderID, "meme");
                        }, 3000)
                    }
                    else if (message.quick_reply.payload.split('|')[1] == "riddle") {
                        var favorites = ["At night they come without being fetched. By day they are lost without being stolen. What are they? \n\n\n\nStars",
                            "What occurs once in every minute, twice in every moment, but never in a thousand years? \n\n\n\nThe Letter M ",
                            "What 8 letter word can have a letter taken away and it still makes a word.  Take another letter away and it still makes a word. Keep on doing that until you have one letter left. What is the word? \n\n\n\nThe word is starting! starting, staring, string, sting, sing, sin, in, I. So cool!!!",
                            "Re-arrange the letters,\n\nO O U S W T D N E J R \n\nto spell just one word. \n\n\n\n'just one word'",
                            "A woman shoots her husband. Then she holds him under water for over 5 minutes. Finally, she hangs him. But 5 minutes later they both go out together and enjoy a wonderful dinner together. How can this be? \n\n\n\nThe woman was a photographer. She shot a picture of her husband, developed it, and hung it up to dry."];

                        var favorite = favorites[Math.floor(Math.random() * favorites.length)];
                        // var postmessage = "hi my favorite site is " + favorite;
                        sendTextMessage(senderID, favorite);
                        console.log(favorite)
                        setTimeout(function () {
                            continueAfterfun(senderID, "riddle");
                        }, 3000)
                    }
                    break;
                case 'menu':
                    sendStartingMessage(senderID);
                    break;

                case 'contactus':
                    sendTextMessage(senderID, "For any queries you can mail me at mayank.k.gandhi@gmail.com . \nThanks!");
                    break;
                case 'restartBot':
                    restart_Bot(senderID)
                    break;
                default:
                    {
                        const sessionId = findOrCreateSession(senderID);
                        if (sessions[sessionId].academicArea === 0) {
                            knownMessage = false;
                            sessions[sessionId].Email = messageText;
                            setTimeout(function () {
                                continueAfterfun(senderID);
                            }, 1000)
                        } else {
                            user_name(senderID);
                            setTimeout(function () {
                                sendStartingMessage(senderID)
                            }, 1000)
                        }
                    }
            }
        }
    }
    else if (messageText) {
        var lowAll = messageText.toLowerCase();
        var greets = ['hi', 'hii', 'hiii', 'hiiii', 'hiiiii', 'hiiiiii', 'hey', 'heyy', 'hello', 'reply', 'test', 'testing', 'dai',
            'buddy', 'bud', 'ji', 'hungry', 'answer pls', 'pls answer', 'answer please', 'please answer',
            'hellooo', 'helloo', 'heloo', 'hell', 'ans pls', 'pls ans', 'ans please', 'please ans',
            'bruh', 'hey', 'hie', 'wassup', 'oye',
            'hui', 'sup', 'bro', 'sup', 'bro', 'heylo',
            'namaste', 'namasthe', 'namasthey', 'aloha', 'ahoy',
            'ahoyy', 'ahoy mate', 'hi mate', 'ciao',
            'guten tag', 'bonjour', 'bonjur', 'hola',
            'olaa', 'ola', 'hallo', 'halo', 'salaam',
            'salam', 'ohayo', 'konichiwa', 'konnichiwa',
            'marhaba', 'merhaba', 'ni hau', 'mate'
        ];

        if (greets.indexOf(lowAll) >= 0) {
            {
                const sessionId = findOrCreateSession(senderID);
                user_name(senderID);
                setTimeout(function () {
                    sendStartingMessage(senderID)
                }, 1000)
            }

        }
        else if (messageText === 'yoaddmenu') {
            addpersistantMenu();
        } else if (messageText === 'yoremovemenu') {
            removePersistentMenu();

        } else {
            {
                const sessionId = findOrCreateSession(senderID);
                apiAI(senderID, messageText);

            }
        }
    }
    else if (messageAttachments) {

        console.log("inside attachements===========")
        console.log(event)
        console.log(messageAttachments)
        if (sticker && messageAttachments[0].type == "image") {
            sendTextMessage(senderID, "Yo! 👍🏼 to you too.")
        } else if (!sticker && messageAttachments[0].type == "image") {
            sendGifMessage(senderID, "not_even_mad");
        }
    }
};

function apiAI(sender, text) {
    const sessionId = findOrCreateSession(sender);
    var request = dialogFlow.textRequest(text, {
        sessionId: sender
    });

    request.on('response', function (response) {
        console.log("api AI response >>>>>");
        let responseText = response.result.fulfillment.speech;
        let responseData = response.result.fulfillment.data;
        let messages = response.result.fulfillment.messages;
        let action = response.result.action;
        let contexts = response.result.contexts;
        let parameters = response.result.parameters;
        let intentName = response.result.metadata.intentName;

        if (action == "") {

            switch (intentName) {
                case 'foul-words':

                    console.log('Unknown query IF ACTION');
                    var favorites = ["You have your entire life to be a jerk. Why not take today off?!",
                        "Please, keep talking. I only yawn when I’m super fascinated.",
                        "Do you talk to your Daddy like this?!",
                        "You don't know how to talk to your Daddy.. Do you?!",
                        "Sorry, I didn’t get that. I don’t speak bullshit.",
                        "Are you always such an idiot, or do you just show off when I’m around?",
                        "I’d tell you how I really feel, but I wasn’t born with enough middle fingers to express myself in this case.",
                        "I'm sorry I didn't get that - I don't speak idiot.",
                        "I'm sorry, was I meant to be offended? The only thing offending me is your face."];

                    var favorite = favorites[Math.floor(Math.random() * favorites.length)];
                    // var postmessage = "hi my favorite site is " + favorite;
                    sendTextMessage(sender, favorite);
                    console.log(favorite)
                    break;
                case 'hobbies':
                    sendTextMessage(sender, "That is really nice. I hope you are having fun! :D")
                    break;
            }
        } else if (response.result.score === 0) {

            console.log('Unknown query ELSE IF CASE');
            //api ai could not evaluate input.
            console.log('Unknown query' + response.result.resolvedQuery);
            sendTextMessage(sender, "I don't understand what you're trying to say! Can you be more specific?");
        } else {
            console.log('Unknown query ELSE CASE');
            sendTextMessage(sender, responseText);
        }


    });

    request.on('error', function (error) {
        console.log("error");
        console.log(error);
    });

    request.end();
}


function sendGifMessage(sender, name) {
    var messageData = {
        recipient: {
            id: sender
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: congifURL + "/assets/" + name + ".gif"
                }
            }
        }
    };

    callSendAPI(messageData);
}

function user_name(sender) {
    console.log(sender)
    const sessionId = findOrCreateSession(sender);

    request.get({
        url: 'https://graph.facebook.com/v2.6/' + sender + '?fields=first_name,gender&access_token=' + PAGE_ACCESS_TOKEN,
        method: 'GET'
    },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                var user_fields = JSON.parse(body);
                console.dir(user_fields);
                var kyz = Object.keys(user_fields);
                console.dir(user_fields[kyz[0]]);
                sessions[sessionId].Name = user_fields[kyz[0]];
            } else {
                console.log('error', body);
                sessions[sessionId].Name = "Facebook User"
            }

            if (sessions[sessionId].Name == "Facebook User") {
                sendTextMessage(sender, "Hey! This is Mayank personal AI Bot. Let's interact and have some fun! 😎 In case you need me, I'm here 24*7 for you 😉 ")
            } else {
                sendTextMessage(sender, "Hey " + sessions[sessionId].Name + "! Let's interact and have some fun! 😎 In case you need me, I'm here 24*7 for you 😉 ")
            }

        });

}


function sendTextMessage(sender, messageText) {
    var messageData = {
        recipient: {
            id: sender
        },
        message: {
            text: messageText
        }

    };
    callSendAPI(messageData);

}

function callSendAPI(messageData) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message." + error);
        }

    });
}

function removePersistentMenu() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            setting_type: "call_to_actions",
            thread_state: "existing_thread",
            call_to_actions: []
        }

    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error removePersistentMenu: ', response.body.error)
        }
    })
}

function sendStartingMessage(sender) {

    var messageData = {
        recipient: {
            id: sender
        },
        message: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Click on the buttons to interact!",
                            "image_url": congifURL + "/assets/the-best.gif",
                            buttons: [
                                {
                                    "type": "web_url",
                                    "title": "Career",
                                    "url": "https://www.linkedin.com/in/mayankketangandhi",
                                    "webview_height_ratio": "full"
                                },
                                {
                                    "type": "postback",
                                    "title": "Hobbies",
                                    "payload": "hobbies",
                                },
                                {
                                    type: "postback",
                                    title: "Fun",
                                    payload: 'fun'
                                },
                            ]
                        }
                    ]
                }
            }
        }

    };
    callSendAPI(messageData)
};




function sendFun(sender) {

    var params = [

        {
            "content_type": "text",
            "title": "Memes for Life!",
            "payload": 'fun|' + "meme"
        },
        // {
        //     "content_type": "text",
        //     "title": "Jokes",
        //     "payload": 'fun|' + "joke"
        // },
        {
            "content_type": "text",
            "title": "Riddles",
            "payload": 'fun|' + "riddle"
        },

    ]
    var messageData = {
        "text": "Cool! What would you like?",
        "quick_replies": params
    }
    request({
        url: 'https://graph.facebook.com/v2.10/me/messages',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test about Site: ', response.body.error)
        }
    })
}





function continueAfterfun(sender, fun) {
    if (fun == "MEME") {

        var params = [


            {
                "content_type": "text",
                "title": "Want more?",
                "payload": 'fun|' + "meme"
            },
            {
                "content_type": "text",
                "title": "Riddles?",
                "payload": 'fun|' + "riddle"
            },
            {
                "content_type": "text",
                "title": "About Me",
                "payload": 'aboutme'
            },

        ]
    } else {
        var params = [

            {
                "content_type": "text",
                "title": "Want more?",
                "payload": 'fun|' + "riddle"
            },
            {
                "content_type": "text",
                "title": "Meme?",
                "payload": 'fun|' + "meme"
            },
            {
                "content_type": "text",
                "title": "About Me",
                "payload": 'aboutme'
            },


        ]
    }
    var messageData = {
        "text": "So what next?",
        "quick_replies": params
    }
    request({
        url: 'https://graph.facebook.com/v2.10/me/messages',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test about Site: ', response.body.error)
        }
    })
}


function Image(sender, pic) {
    messageData = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": congifURL + "/assets/" + pic,
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.10/me/messages',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error Test floor Plan Image ?>>:  ', response.body.error)
        }
    })
}


function sendMail(sender) {
    var params =
        [
            {
                "content_type": "user_email",
            }
        ]
    var messageData = {
        "text": "Click on your Email and we will get back to you with all the necessary details.",
        "quick_replies": params
    }
    request({
        url: 'https://graph.facebook.com/v2.10/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function addpersistantMenu() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            "setting_type": "call_to_actions",
            "thread_state": "existing_thread",
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Restart Bot 🚀",
                    "payload": "restartBot"
                },
                {
                    "type": "postback",
                    "title": "About Me",
                    "payload": 'aboutme'
                },
                {
                    "type": "postback",
                    "title": "Contact Me",
                    "payload": 'contactus'
                },
            ]
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error addpersistantMenu: ', response.body.error)
        }
    })
};


function restart_Bot(sender) {
    const sessionId = findOrCreateSession(sender)

    delete sessions[sessionId];
    setTimeout(function () {
        user_name(sender);
        sendStartingMessage(sender)
    }, 1000)

}



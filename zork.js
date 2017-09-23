const MAX = 100;
const MIN = 1;

function main(args) {

    //handle exit early
    if(args.request.type === 'IntentRequest' &&
        ((args.request.intent.name === 'AMAZON.StopIntent') ||
          (args.request.intent.name === 'AMAZON.CancelIntent'))) {
        let response = {
        "version": "1.0",
        "response" :{
            "shouldEndSession": true,
            "outputSpeech": {
                "type": "PlainText",
                "text": "Bye!"
                }
            }
        }

        return {response:response};
    }

    //treat launch like help
    let intent;
    if(args.request.type === 'LaunchRequest') {
        intent = 'AMAZON.HelpIntent';
    } else {
        intent = args.request.intent.name;
    }

    //Default response object
    let response = {
        "version":"1.0",
        "response":{
            "outputSpeech": {
                "type":"PlainText"
            }
        }
    };

    //copy session over
    if("session" in args && "attributes" in args.session) {
        response.sessionAttributes = args.session.attributes;
    } else response.sessionAttributes = { "game_state" : 3 };

    if(intent === "AMAZON.HelpIntent") {

        response.response.shouldEndSession = true;
        response.response.outputSpeech.text = "`Welcome to Zork! Say start to begin.";

    } else if(intent === "start") {

        console.log("Starting at Game State: ", response.sessionAttributes.game_state );

        //keep session open
        response.response.shouldEndSession = false;

        response.response.outputSpeech.text = "You are standing in an open field west of a white house, with a boarded front door.A secret path leads southwest into the forest. There is a Small Mailbox.";

        //now prompt the user
        response.response.reprompt = {
            "outputSpeech":{
                "type": "PlainText",
                "text": "What do you do?"
            }
        };

    } else if(intent === "numberguess") {

        /*
        possible the user skipped starting a new game and just guessed a number,
        if so, default:
        */
        if(!response.sessionAttributes.chosen) {
            response.sessionAttributes.chosen = pickNumber();
            response.sessionAttributes.guesses = 0;
        }

        let guess = args.request.intent.slots.guess.value;
        console.log('user guessed '+guess);

        //increment guesses
        ++response.sessionAttributes.guesses;

        if(guess == response.sessionAttributes.chosen) {
            response.response.shouldEndSession = true;
            //reset to a new number
            response.sessionAttributes.chosen = pickNumber();
            response.response.outputSpeech.text = "You guessed right, congratulations! It took you " +
            response.sessionAttributes.guesses + " guesses!";
        } else {
            response.response.shouldEndSession = false;
            response.response.outputSpeech.text = "Sorry, you guessed wrong. Try again!";

            //now prompt the user
            response.response.reprompt = {
                "outputSpeech":{
                    "type": "PlainText",
                    "text": "What number do you guess?"
                }
            };
        }

    }

    console.log('returning '+JSON.stringify(response));
    return response;
}

function pickNumber() {
    return Math.floor(Math.random() * (MAX-MIN+1))+MIN;
}



// exports.handler = (event, context) => {

//   try {

//     if (event.session.new) {
//       // New Session
//       console.log("NEW SESSION")
//     }

//     switch (event.request.type) {

//       case "LaunchRequest":
//         // Launch Request
//         console.log(`LAUNCH REQUEST`)
//         context.succeed(
//           generateResponse(
//             buildSpeechletResponse("Welcome to an Alexa Skill, this is running on a deployed lambda function", true),
//             {}
//           )
//         )
//         break;

//       case "IntentRequest":
//         // Intent Request
//         console.log(`INTENT REQUEST`)

//         switch(event.request.intent.name) {
//           case "PlayZork":
//             var endpoint = "" // ENDPOINT GOES HERE
//             var body = ""
//             context.succeed(
//               generateResponse(
//                 buildSpeechletResponse(`Welcome to Zork! You are standing in an open field west of a white house, with a boarded front door.A secret path leads southwest into the forest. There is a Small Mailbox. What do you do? {}`, false),
//                   game_state: { type:int, text: 3} ) );
//             break;

//           default:
//             throw "Invalid intent"
//         }

//         break;

//       case "SessionEndedRequest":
//         // Session Ended Request
//         console.log(`SESSION ENDED REQUEST`)
//         break;

//       default:
//         context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

//     }

//   } catch(error) { context.fail(`Exception: ${error}`) }

// }

// // Helpers
// buildSpeechletResponse = (outputText, shouldEndSession) => {

//   return {
//     outputSpeech: {
//       type: "PlainText",
//       text: outputText
//     },
//     shouldEndSession: shouldEndSession
//   }

// }

// generateResponse = (speechletResponse, sessionAttributes) => {

//   return {
//     version: "1.0",
//     sessionAttributes: sessionAttributes,
//     response: speechletResponse
//   }

// }

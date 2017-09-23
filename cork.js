exports.handler = (event, context) => {

  try {
    var session = event.session;

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to Zork! Say begin to start your adventure!", false), {"game_state" : 3}
          )
        );
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "PlayZork":
            console.log("ATTRIBUTES: " + session.attributes);
            console.log("GAME STATE: " + session.attributes["game_state"]);
            if (session.attributes["game_state"] === 3) {
                var user_input = JSON.stringify(event, null, 2);
                console.log(user_input);
                // var user_input = event.request.intent.slots.Input;
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse("c out hi", false)
                      ) );
            }
            else {
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse("You are standing in an open field west of a white house, with a boarded front door.A secret path leads southwest into the forest. There is a Small Mailbox. What do you do? ", false)
                      ) );
            }    
            break;

          default:
            throw "Invalid intent"
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }
}

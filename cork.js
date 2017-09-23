exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log("LAUNCH REQUEST")
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to an Alexa Skill, this is running on a deployed lambda function", true),
            {}
          )
        )
        break;

      case "IntentRequest":
        // Intent Request
        console.log("INTENT REQUEST")

        switch(event.request.intent.name) {
            case "PlayZork":
                this.attributes['game_state'] = 0;
                console.log("Game state: " + this.attributes['game_state']);
                this.emit(':ask', "Welcome to Zork! You are standing in an open 
                field west of a white house, with a boarded front door.
                A secret path leads southwest into the forest. There is a Small
                Mailbox.", "What do you do?");
                break;
            default:
                throw "Invalid intent"
        }
        break;
      case "SessionEndedRequest":
        // Session Ended Request
        console.log("SESSION ENDED REQUEST")
        break;
      default:
        context.fail("INVALID REQUEST TYPE: ${event.request.type}")
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

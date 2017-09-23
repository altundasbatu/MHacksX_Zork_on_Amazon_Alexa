exports.handler = (event, context) => {

  try {
    var session = event.session;

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
      context.succeed(
        generateResponse(
          buildSpeechletResponse("Welcome to Zork! Say begin to start your adventure!", false), {"game_state" : 1}
        )
      );
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`);
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "PlayZork":
            console.log("EVENT: " + JSON.stringify(event, null, 2));
            console.log("ATTRIBUTES: " + session.attributes);
            console.log("GAME STATE: " + session.attributes["game_state"]);
            if (session.attributes["game_state"] === 1) {
                // You are standing in an open field west of a white house, with a boarded front door.A secret path leads southwest into the forest. There is a Small Mailbox. 
                buildResponse(context, "What do you do?", 3);
            }
            else if (session.attributes["game_state"] === 3) {
              user_input = event.request.intent.slots.Zorkput.value;
              console.log("USER INPUT: " + user_input);
              if (user_input.includes("mailbox")) {
                user_input = null;
                buildResponse(context, "You cannot be serious.", 3);
              }
              else {
                buildResponse(context, "Say something else rainbow head", 3);
              }
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

buildResponse = (context, output, game_state) => {
  context.succeed(
    generateResponse(
      buildSpeechletResponse(output, false), {"game_state" : game_state}
    )
  );
}
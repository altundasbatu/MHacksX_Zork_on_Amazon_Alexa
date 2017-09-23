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
        console.log("LAUNCH REQUEST")
        buildResponse(context, "Welcome to Zork! Say begin to start your adventure!", 1);
        break;

      case "IntentRequest":
        // Intent Request
        console.log("INTENT REQUEST");

        switch(event.request.intent.name) {
          case "PlayZork":
            // console.log("ATTRIBUTES: " + session.attributes);
            // console.log("GAME STATE: " + session.attributes["game_state"]);
            switch(session.attributes["game_state"]) {
              case 1:
                game_state_1(event, context);
                break;
              case 3:
                game_state_3(event, context);
                break;
              case 4:
                game_state_4(event, context);
                break;
              case 8:
                game_state_8(event, context);
                break;
              case 9:
                game_state_9(event, context);
                break;
              case 10:
                game_state_10(event, context);
                break;
              case 11:
                game_state_11(event, context);
                break;
              default:
                buildResponse(context, "Invalid game state, start over", 1);
                break;
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

game_state_1 = (event, context) => {
  buildResponse(context, "You are standing in an open field west of a white house, with a boarded front door." +
                         "(A secret path leads southwest into the forest.)" +
                         "There is a Small Mailbox.", 3);
}

game_state_3 = (event, context) => {
  user_input = event.request.intent.slots.Zorkput.value;
  if (user_input === "take mailbox") {
    buildResponse(context, "You cannot be serious.", 4);
  }
  else {
    buildResponse(context, "Nope jk you suck, no can do", 4);
  }
}

buildResponse = (context, output, game_state) => {
  context.succeed(
    generateResponse(
      buildSpeechletResponse(output, false), {"game_state" : game_state}
    )
  );
}
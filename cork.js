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
        console.log(`LAUNCH REQUEST`);
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to Zork!", false), {"game_state" : 1}
          )
        );
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        console.log("EVENT: " + JSON.stringify(event, null, 2));
        console.log("GAME STATE: " + session.attributes["game_state"]);
        console.log("USER INPUT: " + event.request.intent.slots.Zorkput.value);

        user_action = event.request.intent.slots.Action.value;
        user_item = event.request.intent.slots.Zorkput.value;
        game_state = session.attributes["game_state"];

        switch(event.request.intent.name) {
          case "PlayZork":
            if (user_action !== undefined && user_item !== undefined) {
              if (game_state === 1) {
                // You are standing in an open field west of a white house, with a boarded front door.A secret path leads southwest into the forest. There is a Small Mailbox. 
                buildResponse(context, "What do you do?", 3);
              }
              else if (game_state === 3) {
                buildResponse(context, user_action + user_item, 3);
              }
            }
            else  {
              buildResponse(context, "Say something else", 3);
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

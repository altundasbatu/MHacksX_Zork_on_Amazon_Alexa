exports.handler = (event, context) => {

  try {
    var session = event.session;
    var suits = ["spades", "hearts", "clubs", "diamonds"];
    var ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];
    var soloActions = ["Do 5 push ups",
                       "Do 10 push ups",
                       "Drink with anyone you choose!",
                       "Drink!",
                       "You can't speak for three rounds",
                       "Pick a person to mute",
                       "Do 5 jumping jacks or drink",
                       "If you are wearing socks, drink"];
    var groupActions = ["hug the person who has",
                        "slap the person who has",
                        "drink with the person who has",
                        ];
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
            buildSpeechletResponse("Welcome to Cardy Party Game! Say help if it's your first time.", false)
          )
        );

        buildReprompt(context, "Are you ready to play?");
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`YES INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "PlayIntent":
            var randomRankIndex = getRandomInt(0, 13);
            var randomSuitIndex = getRandomInt(0, 4);
            var randomRank = ranks[randomRankIndex];
            var randomSuit = suits[randomSuitIndex];
            buildResponse(context, "I choose " + randomRank + " of " + randomSuit);

            break;
          case "AMAZON.HelpIntent":
            buildResponse(context, "Deal an entire deck of cards to all players. When you are ready say, launch Party Game and follow the instructions. Have fun!");
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

buildSpeechletReprompt = (outputText, shouldEndSession) => {
  return {
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: outputText
      },
      shouldEndSession: shouldEndSession
    }
  }
}

generateResponse = (speechletResponse, sessionAttributes) => {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }
}

buildResponse = (context, output) => {
  context.succeed(
    generateResponse(
      buildSpeechletResponse(output, false)
    )
  );
}

buildReprompt = (context, output) => {
  context.succeed(
    generateResponse(
      buildSpeechletReprompt(output, false)
    )
  );
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
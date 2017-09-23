exports.handler = (event, context) => {

  try {
    var session = event.session;
    var suites = ["spades", "hearts", "clubs", "diamonds"];
    var ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"];
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
            buildSpeechletResponse("Welcome to Cardy Party Game! Are you ready to play?", false)
          )
        );
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "PlayIntent":
            var randomRankIndex = getRandomInt(0, 13);
            var randomSuitIndex = getRandomInt(0, 4);
            var randomRank = ranks[randomRankIndex];
            var randomSuit = suits[randomSuitIndex];
            buildResponse(context, "I choose " + randomRank + " of " + randomSuit);

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

buildResponse = (context, output) => {
  context.succeed(
    generateResponse(
      buildSpeechletResponse(output, false)
    )
  );
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
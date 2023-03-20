import BotFactory from "../logic/BotFactory";

class Evolution {
  private matchIndex = 0;

  public setupSurvivalOfTheFittest(numberOfBots: number) {
    const matches = {};

    for (let i = 1; i <= numberOfBots; i++) {
      for (let k = 1; k <= numberOfBots; k++) {
        if (i !== k) {
          const firstBotName = `BOT_${i}`;
          const secondBotName = `BOT_${k}`;
          const matchKey = `${firstBotName}|${secondBotName}`;
          const inverseKey = `${secondBotName}|${firstBotName}`;

          // @ts-expect-error fix
          if (!matches[inverseKey]) {
            // @ts-expect-error fix
            matches[matchKey] = {
              winner: "N/A",
              [firstBotName]: {
                EDGE_PENALTY: randomNumber(1, 20),
                CORNER_PENALTY: randomNumber(1, 40),
                LARGEST_STACK_BONUS: randomNumber(1, 100),
              },
              [secondBotName]: {
                EDGE_PENALTY: randomNumber(1, 20),
                CORNER_PENALTY: randomNumber(1, 40),
                LARGEST_STACK_BONUS: randomNumber(1, 100),
              },
            };
          }
        }
      }
    }

    return matches;
  }

  public setup() {
    const matchesToPlay = this.setupSurvivalOfTheFittest(2);

    const matchToPlay = Object.keys(matchesToPlay)[this.matchIndex];

    const botOneName = matchToPlay.split("|")[0];
    const botTwoName = matchToPlay.split("|")[1];
    // @ts-expect-error fix
    const botOneParameters = matchesToPlay[matchToPlay][botOneName];
    // @ts-expect-error fix
    const botTwoParameters = matchesToPlay[matchToPlay][botTwoName];

    const botTwo = new BotFactory({
      VERSION: 1,
      CORNER_PENALTY_MULTIPLIER: 1,
      COUNT_SCORE_MULTIPLIER: 1,
      EDGE_PENALTY_MULTIPLIER: 1,
      LARGEST_STACK_BONUS_MULTIPLIER: 1,
      SCORE_FOR_STACKS_THREATENED_MULTIPLIER: 1,
      STACK_SIZE_SCORE_MULTIPLIER: 1,
      STACK_VALUE_BONUS_MULTIPLIER: 1,
    });
    const botOne = new BotFactory({
      VERSION: 2,
      CORNER_PENALTY_MULTIPLIER: 1,
      COUNT_SCORE_MULTIPLIER: 1,
      EDGE_PENALTY_MULTIPLIER: 1,
      LARGEST_STACK_BONUS_MULTIPLIER: 1,
      SCORE_FOR_STACKS_THREATENED_MULTIPLIER: 1,
      STACK_SIZE_SCORE_MULTIPLIER: 1,
      STACK_VALUE_BONUS_MULTIPLIER: 1,
    });

    console.log(`${botOneName} VERSUS ${botTwoName}`);
    console.log(`Bot one weights: `, botOneParameters);
    console.log(`Bot two weights`, botTwoParameters);
  }
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default new Evolution();

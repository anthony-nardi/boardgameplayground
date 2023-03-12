export let game_id: number | string = 0;

export function setGameId(id: number | string) {
  game_id = id;
  // @ts-expect-error fix
  let existingGames = JSON.parse(localStorage.getItem("tzaar_games"));

  if (!existingGames) {
    existingGames = {};
  }

  const gameIds = Object.keys(existingGames);

  for (let i = 0; i < gameIds.length; i++) {
    if (existingGames[gameIds[i]].length === 0) {
      delete existingGames[gameIds[i]];
    }
  }

  existingGames[game_id] = [];

  localStorage.setItem("tzaar_games", JSON.stringify(existingGames));
}

export function getGameId() {
  return game_id;
}

export function addFirstHumanMoveToCurrentGame(move: string) {
  // @ts-expect-error fix
  let existingGames = JSON.parse(localStorage.getItem("tzaar_games"));
  if (!existingGames || !existingGames[game_id]) {
    throw new Error("Game doesnt exist");
  }
  existingGames[game_id].push(move);
  localStorage.setItem("tzaar_games", JSON.stringify(existingGames));
}

export function addSecondHumanMoveToCurrentGame(move: string) {
  // @ts-expect-error fix
  let existingGames = JSON.parse(localStorage.getItem("tzaar_games"));
  if (!existingGames || !existingGames[game_id]) {
    throw new Error("Game doesnt exist");
  }
  const moveToAddTo = existingGames[game_id].pop();
  existingGames[game_id].push(`${moveToAddTo}=>${move}`);
  localStorage.setItem("tzaar_games", JSON.stringify(existingGames));
}

export function addAIMoveToCurrentGame(move: string) {
  // @ts-expect-error fix
  let existingGames = JSON.parse(localStorage.getItem("tzaar_games"));
  if (!existingGames || !existingGames[game_id]) {
    throw new Error("Game doesnt exist");
  }
  existingGames[game_id].push(move);
  localStorage.setItem("tzaar_games", JSON.stringify(existingGames));
}

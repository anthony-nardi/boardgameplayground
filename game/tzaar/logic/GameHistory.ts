class GameHistory {
  private _game_id: number | string = 0;
  private _local_storage_key = "tzaar_games";

  public setGameId(id: number | string) {
    this._game_id = id;
    let existingGames;

    const tzaarGames = localStorage.getItem(this._local_storage_key);

    if (tzaarGames) {
      existingGames = JSON.parse(tzaarGames);
    } else {
      existingGames = {};
    }

    const gameIds = Object.keys(existingGames);

    for (let i = 0; i < gameIds.length; i++) {
      if (existingGames[gameIds[i]].length === 0) {
        delete existingGames[gameIds[i]];
      }
    }

    existingGames[this._game_id] = [];

    localStorage.setItem(
      this._local_storage_key,
      JSON.stringify(existingGames)
    );
  }

  public getGameId() {
    return this._game_id;
  }

  public addFirstHumanMoveToCurrentGame(move: string) {
    const tzaarGames = localStorage.getItem(this._local_storage_key);

    if (tzaarGames) {
      let existingGames = JSON.parse(tzaarGames);
      if (!existingGames || !existingGames[this._game_id]) {
        throw new Error("Game doesnt exist");
      }
      existingGames[this._game_id].push(move);
      localStorage.setItem(
        this._local_storage_key,
        JSON.stringify(existingGames)
      );
    }
  }

  public addSecondHumanMoveToCurrentGame(move: string) {
    const tzaarGames = localStorage.getItem(this._local_storage_key);

    if (tzaarGames) {
      let existingGames = JSON.parse(tzaarGames);
      if (!existingGames || !existingGames[this._game_id]) {
        throw new Error("Game doesnt exist");
      }
      const moveToAddTo = existingGames[this._game_id].pop();
      existingGames[this._game_id].push(`${moveToAddTo}=>${move}`);
      localStorage.setItem(
        this._local_storage_key,
        JSON.stringify(existingGames)
      );
    }
  }

  public addAIMoveToCurrentGame(move: string) {
    const tzaarGames = localStorage.getItem(this._local_storage_key);

    if (tzaarGames) {
      let existingGames = JSON.parse(tzaarGames);
      if (!existingGames || !existingGames[this._game_id]) {
        throw new Error("Game doesnt exist");
      }
      existingGames[this._game_id].push(move);
      localStorage.setItem(
        this._local_storage_key,
        JSON.stringify(existingGames)
      );
    }
  }
}

export default new GameHistory();

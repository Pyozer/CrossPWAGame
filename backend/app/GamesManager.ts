import { isNull } from "./utils/FuncUtils";
import Game from "./game/Game";
import MagicNumberGame from "./game/MagicNumber";

export default class GamesManager {
    private static instance: GamesManager;
    private games: Game[] = [];

    public static getInstance(): GamesManager {
        if (isNull(this.instance)) {
            this.instance = new GamesManager();
        }
        return this.instance;
    }

    public findOrCreateGame(game: string): Game {
        let gameInstance: Game = this.findAvailableGame(game);
        if (isNull(gameInstance)) {
            gameInstance = this.createNewGame(game);
            this.games.push(gameInstance);
        }
        return gameInstance;
    }

    private findAvailableGame(gameName: string): Game {
        return this.games.find(game => {
            return game.name === gameName && !game.isGameFull();
        });
    }

    private createNewGame(gameName: string): Game {
        if (gameName === 'magicnumber') {
            return new MagicNumberGame();
        }
        throw new Error('Unknown game !');
    }
}
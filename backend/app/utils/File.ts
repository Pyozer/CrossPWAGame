import { promises as fs } from 'fs';
import { isNull } from './FuncUtils';

export const saveGameInFile = async (gameName: string, gameJSON: object): Promise<void> => {
    const content = await fs.readFile('data/games.json');

    const games = JSON.parse(content.toString());
    if (isNull(games[gameName])) {
        games[gameName] = [];
    }
    games[gameName].push(gameJSON);

    await fs.writeFile('data/games.json', JSON.stringify(games, null, 2));
};
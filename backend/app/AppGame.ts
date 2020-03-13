import SocketIO from 'socket.io';
import Player from './models/Player';
import MagicNumberGame from './game/MagicNumber';
import Game from './game/Game';
import { isNull } from './utils/FuncUtils';
import User from './models/User';

export default class AppGame {
    private users: Record<string, User> = {};
    private io: SocketIO.Server;
    private games: Game[] = [];

    constructor(io: SocketIO.Server) {
        this.io = io;
        this.initListeners();
    }

    private initListeners(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            console.log('[GameServer.ts] > onConnection: ', socket.id);

            socket.on('disconnect', () => this.onDisconnect(socket));
            socket.on('Game::sendNickname', nickname => this.onSendNickname(socket, nickname));
            socket.on('Game::join', game => this.onGameJoin(socket, game));
        });
    }

    /* Socket Client listeners */
    private onDisconnect(socket: SocketIO.Socket): void {
        delete this.users[socket.id];

        console.log('[GameServer.ts] > onDisconnectListener: ', socket.id);
    }

    private onSendNickname(socket: SocketIO.Socket, nickname: string): void {
        this.users[socket.id] = { nickname };
        socket.emit('Game::playerInfo', {
            id: socket.id,
            nickname,
            points: 0
        });

        console.log('[GameServer.ts] > onSendNicknameListener: ', socket.id, nickname);
    }

    private onGameJoin(socket: SocketIO.Socket, game: string): void {
        const player = new Player(socket, this.users[socket.id].nickname);

        console.log('[GameServer.ts] > onGameJoinListener: ', socket.id, game);

        let gameInstance: Game = this.findAvailableGame(game);
        if (isNull(gameInstance)) {
            gameInstance = this.createNewGame(game);
            this.games.push(gameInstance);
        }
        this.users[socket.id].game = gameInstance;

        gameInstance.addPlayer(player);
        if (gameInstance.isGameFull()) {
            gameInstance.startGame();
        }
    }

    private findAvailableGame(gameName: string): Game {
        return this.games.find((game) => game.name === gameName && !game.isGameFull());
    }

    private createNewGame(gameName: string): Game {
        if (gameName === 'magicnumber') {
            return new MagicNumberGame();
        }
        throw new Error('Game unknown !');
    }
}
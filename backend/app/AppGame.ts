import SocketIO from 'socket.io';
import Player from './models/Player';
import Game from './game/Game';
import User from './models/User';
import GamesManager from './GamesManager';

export default class AppGame {
    private users: Record<string, User> = {};
    private io: SocketIO.Server;

    constructor(io: SocketIO.Server) {
        this.io = io;
        this.initListeners();
    }

    private initListeners(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('disconnect', () => this.onDisconnect(socket));
            socket.on('Game::sendNickname', name => this.onSendNickname(socket, name));
            socket.on('Game::join', game => this.onGameJoin(socket, game));
        });
    }

    private onDisconnect(socket: SocketIO.Socket): void {
        delete this.users[socket.id];
    }

    private onSendNickname(socket: SocketIO.Socket, nickname: string): void {
        this.users[socket.id] = { nickname };
        socket.emit('Game::playerInfo', {
            id: socket.id,
            nickname,
            points: 0
        });
    }

    private onGameJoin(socket: SocketIO.Socket, game: string): void {
        const player = new Player(socket, this.users[socket.id].nickname);

        let gameInstance: Game = GamesManager.getInstance().findOrCreateGame(game);
        this.users[socket.id].game = gameInstance;

        gameInstance.addPlayer(player);
        if (gameInstance.isGameFull()) {
            gameInstance.startGame();
        }
    }
}

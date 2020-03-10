import { isNull } from './../utils/FuncUtils';
import { Socket } from 'socket.io';
import uuid = require('uuid');

class Player {
    id: string;
    socket: Socket;
    nickname: string;
    points = 0;

    constructor(socket: Socket, nickname: string) {
        this.id = uuid.v4();
        this.socket = socket;
        this.nickname = nickname;
    }

    toJSON(): object {
        return {
            'name': this.nickname,
            'points': this.points
        };
    }
}

class Game {
    players: Player[];
    magicNumber: number;
    begin: Date;
    end: Date;

    constructor(players: Player[] = []) {
        this.players = players;
    }

    addPlayer(player: Player): void {
        this.players.push(player);
    }

    startGame(): void {
        for (const player of this.players) {
            player.points = 0;
        }
        this.begin = new Date();
        this.updateMagicNumber();
        this.players.forEach(({ socket }) => {
            socket.emit('magicnumber::gameStart');
        });
    }

    updateMagicNumber() {
        this.magicNumber = Math.floor(Math.random() * 1337);
        console.log(this.magicNumber);
    }

    endGame(): void {
        this.end = new Date();
    }

    isPlayerWinner(playerId: string): boolean {
        return this.players.find((p) => p.id === playerId)?.points === 3;
    }

    notifyOthers(playerId: string, callback: (player: Player) => void): void {
        this.players.filter((p) => p.id !== playerId).forEach(callback);
    }

    tryNumber(numberTry: number, playerId: string): void {
        const player = this.players.find((p) => p.id === playerId);
        if (isNull(player)) return;

        if (numberTry === this.magicNumber) {
            player.points++;
            player.socket.emit('magicnumber::playerInfo', {
                id: player.id,
                nickname: player.nickname,
                points: player.points
            });

            if (this.isPlayerWinner(player.id)) {
                player.socket.emit('magicnumber::win');
                this.notifyOthers(player.id, (p) => p.socket.emit('magicnumber::lose'));
            } else {
                player.socket.emit('magicnumber::winPoint');
                this.notifyOthers(
                    player.id,
                    (p) => p.socket.emit('magicnumber::losePoint', { playerName: player.nickname })
                );
                this.updateMagicNumber();
            }
        } else if (numberTry < this.magicNumber) {
            player.socket.emit('magicnumber::numberIsMore');
        } else {
            player.socket.emit('magicnumber::numberIsLess');
        }
    }

    toJSON(): object {
        return {
            'beg': this.begin.toISOString(),
            'end': this.end.toISOString(),
            'players': this.players.map((p) => p.toJSON())
        };
    }
}

let game: Game;

export const onClient = (socket: Socket): void => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('Got disconnect!');
        const i = game?.players?.findIndex(({ socket }) => socket.id === socket.id);
        game?.players?.splice(i, 1);
    });

    socket.emit('magicnumber::hello');

    socket.on('magicnumber::initialize', payload => {
        if (!game) {
            game = new Game();
        }

        if (game.players.length >= 2) {
            socket.emit('magicnumber::gameFull');
            return;
        }

        const player = new Player(socket, payload.nickname);
        game.addPlayer(player);
        console.log('new name received: ', player.nickname);

        socket.emit('magicnumber::playerInfo', {
            id: player.id,
            nickname: player.nickname,
            points: player.points
        });

        if (game.players.length === 2) {
            game.startGame();
        }
    });

    socket.on('magicnumber::tryNumber', payload => {
        game.tryNumber(payload.number, payload.id);
    });
};

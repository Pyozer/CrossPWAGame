import Player from '../models/Player';
import { Socket } from 'socket.io';

type PlayerCallback = (player: Player) => void;

abstract class Game {
    name: string;
    players: Player[];
    begin: Date;
    end: Date;

    constructor(name: string, players: Player[] = []) {
        this.name = name;
        this.players = players;
    }

    addPlayer(player: Player): void {
        this.players.push(player);
    }

    removePlayer(playerSocketId: string): void {
        const i = this.players.findIndex(({ socket }) => socket.id === playerSocketId);
        if (i >= 0) {
            this.players.splice(i, 1);
        }
    }

    startGame(): void {
        for (const player of this.players) {
            player.points = 0;
        }
        this.begin = new Date();
        this.end = null;
        this.notifyAll(({ socket }) => this.emitEvent(socket, 'gameStart'));
    }

    endGame(): void {
        this.end = new Date();
        this.notifyAll(({ socket }) => this.emitEvent(socket, 'gameEnd'));
        // TODO: Save in file the game using toJSON()
    }

    isPlayerWinner(playerId: string): boolean {
        return this.players.find((p) => p.id === playerId)?.points === 3;
    }

    notifyOthers(playerId: string, callback: PlayerCallback): void {
        this.players.filter((p) => p.id !== playerId).forEach(callback);
    }
    notifyAll(callback: PlayerCallback): void {
        this.players.forEach(callback);
    }

    emitEvent(socket: Socket, event: string, payload?: object): boolean {
        return socket.emit(`${this.name}::${event}`, payload);
    }

    onEvent(socket: Socket, event: string, callback: (payload: any) => void): void {
        socket.on(`${this.name}::${event}`, callback);
    }

    abstract onClient(socket: Socket): void;

    toJSON(): object {
        return {
            'beg': this.begin.toISOString(),
            'end': this.end.toISOString(),
            'players': this.players.map((p) => p.toJSON())
        };
    }
}

export default Game;
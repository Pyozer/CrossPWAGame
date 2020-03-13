import Player from '../models/Player';
import { Socket } from 'socket.io';

type PlayerCallback = (player: Player) => void;

export default abstract class Game {
    name: string;
    players: Player[];
    maxPlayer: number;
    begin: Date;
    end: Date;

    constructor(name: string, maxPlayers = 2, players: Player[] = []) {
        this.name = name;
        this.maxPlayer = maxPlayers;
        this.players = players;
    }

    public isGameFull(): boolean {
        return this.players.length >= this.maxPlayer;
    }

    public addPlayer(player: Player): boolean {
        if (this.isGameFull()) return false;

        this.players.push(player);
        this.initPlayerListeners(player.socket);
        this.emitEvent(player.socket, 'playerInfo', {
            id: player.socket.id,
            nickname: player.nickname,
            points: player.points
        });
        return true;
    }

    public playerDisconnected(playerSocketId: string): void {
        const i = this.players.findIndex(({ socket }) => socket.id === playerSocketId);
        if (i === -1) return;

        this.players.splice(i, 1);
        this.forceEndGame();
    }

    public startGame(): void {
        for (const player of this.players) {
            player.points = 0;
        }
        this.begin = new Date();
        this.end = null;
        this.notifyAll(({ socket }) => this.emitEvent(socket, 'gameStart'));
    }

    public endGame(playerWinner: Player): void {
        this.end = new Date();
        this.emitEvent(playerWinner.socket, 'gameEnd', 'win');
        this.notifyOthers(playerWinner.socket.id, (p) => this.emitEvent(p.socket, 'gameEnd', 'lose'));
        // TODO: Save in file the game using toJSON()
    }
    
    private forceEndGame(): void {
        this.notifyAll(({ socket }) => this.emitEvent(socket, 'gameForceEnd'));
    }

    public isPlayerWinner(playerId: string): boolean {
        return this.players.find((p) => p.socket.id === playerId)?.points === 3;
    }

    protected notifyOthers(playerIdExclude: string, callback: PlayerCallback): void {
        this.players.filter((p) => p.socket.id !== playerIdExclude).forEach(callback);
    }
    protected notifyAll(callback: PlayerCallback): void {
        this.players.forEach(callback);
    }

    protected emitEvent(socket: Socket, event: string, payload?: any): boolean {
        return socket.emit(`${this.name}::${event}`, payload);
    }

    protected onEvent(socket: Socket, event: string, callback: (payload: any) => void): void {
        socket.on(`${this.name}::${event}`, callback);
    }

    protected initPlayerListeners(socket: Socket): void {
        socket.on('disconnect', () => {
            console.log('Got disconnect in game!');
            this.playerDisconnected(socket.id);
        });
    }

    protected toJSON(): object {
        return {
            'beg': this.begin.toISOString(),
            'end': this.end.toISOString(),
            'players': this.players.map((p) => p.toJSON())
        };
    }
}
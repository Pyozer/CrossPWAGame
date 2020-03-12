import { isNull } from './../utils/FuncUtils';
import { Socket } from 'socket.io';
import Game from './Game';
import Player from '../models/Player';

export default class MagicNumberGame extends Game {
    magicNumber: number;

    constructor() {
        super('magicnumber');
    }

    startGame(): void {
        super.startGame();
        this.updateMagicNumber();
    }

    updateMagicNumber(): void {
        this.magicNumber = Math.floor(Math.random() * 1337);
        console.log(this.magicNumber);
    }

    onTryNumber(numberTry: number, playerId: string): void {
        const player = this.players.find((p) => p.id === playerId);
        if (isNull(player)) return;

        if (numberTry === this.magicNumber) {
            player.points++;
            this.emitEvent(player.socket, 'playerInfo', {
                id: player.id,
                nickname: player.nickname,
                points: player.points
            });

            if (this.isPlayerWinner(player.id)) {
                this.emitEvent(player.socket, 'win');
                this.notifyOthers(player.id, (p) => this.emitEvent(p.socket, 'lose'));
            } else {
                this.emitEvent(player.socket, 'winPoint');
                this.notifyOthers(
                    player.id,
                    (p) => this.emitEvent(p.socket, 'losePoint', { playerName: player.nickname })
                );
                this.updateMagicNumber();
            }
        } else if (numberTry < this.magicNumber) {
            this.emitEvent(player.socket, 'numberIsMore');
        } else {
            this.emitEvent(player.socket, 'numberIsLess');
        }
    }

    onInitialize(socket: Socket, payload: any): void {
        if (this.players.length >= 2) {
            this.emitEvent(socket, 'gameFull');
            return;
        }

        const player = new Player(socket, payload.nickname);
        this.addPlayer(player);
        console.log('new name received: ', player.nickname);

        this.emitEvent(socket, 'playerInfo', {
            id: player.id,
            nickname: player.nickname,
            points: player.points
        });

        if (this.players.length === 2) {
            this.startGame();
        }
    }

    onClient(socket: Socket): void {
        console.log('User connected to MagicNumber');

        socket.on('disconnect', () => {
            console.log('Got disconnect!');
            this.removePlayer(socket.id);
        });

        this.onEvent(socket, 'initialize', payload => {
            this.onInitialize(socket, payload);
        });

        this.onEvent(socket, 'tryNumber', payload => {
            this.onTryNumber(payload.number, payload.id);
        });
    }
}

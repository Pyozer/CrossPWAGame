import { isNull } from './../utils/FuncUtils';
import { Socket } from 'socket.io';
import Game from './Game';

export default class MagicNumberGame extends Game {
    magicNumber: number;

    constructor() {
        super('magicnumber');
    }

    public startGame(): void {
        super.startGame();
        this.updateMagicNumber();
    }

    private updateMagicNumber(): void {
        this.magicNumber = Math.floor(Math.random() * 1337);
        console.log(this.magicNumber);
    }

    onTryNumber(numberTry: number, playerId: string): void {
        const player = this.players.find(p => p.socket.id === playerId);
        if (isNull(player)) return;

        if (numberTry === this.magicNumber) {
            player.points++;
            player.socket.emit('Game::playerInfo', {
                id: player.socket.id,
                nickname: player.nickname,
                points: player.points
            });

            if (this.isPlayerWinner(player.socket.id)) {
                this.endGame(player);
            } else {
                this.emitEvent(player.socket, 'winPoint');
                this.notifyOthers(player.socket.id, p =>
                    this.emitEvent(p.socket, 'losePoint', {
                        playerName: player.nickname
                    })
                );
                this.updateMagicNumber();
            }
        } else if (numberTry < this.magicNumber) {
            this.emitEvent(player.socket, 'numberIsMore');
        } else {
            this.emitEvent(player.socket, 'numberIsLess');
        }
    }

    protected initPlayerListeners(socket: Socket): void {
        super.initPlayerListeners(socket);
        this.onEvent(socket, 'tryNumber', payload => {
            this.onTryNumber(payload.number, payload.id);
        });
    }
}

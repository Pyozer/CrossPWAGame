import { Socket } from 'socket.io';

export class Player {
    socket: Socket;
    nickname: string;
    points = 0;

    constructor(socket: Socket, nickname: string) {
        this.socket = socket;
        this.nickname = nickname;
    }
    
    toJSON(): object {
        return {
            name: this.nickname,
            points: this.points
        };
    }
}

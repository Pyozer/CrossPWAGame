import { Socket } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';

class Player {
    id: string;
    socket: Socket;
    nickname: string;
    points = 0;

    constructor(socket: Socket, nickname: string) {
        this.id = uuidV4();
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

export default Player;
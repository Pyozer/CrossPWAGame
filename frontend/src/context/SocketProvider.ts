import { createContext } from "react";
import { Player } from "../models/Player";

export type SocketContextProps = {
    io: SocketIOClient.Socket;
    player?: Player;
    updatePlayer: (player: Player) => void
}

export const SocketContext = createContext<Partial<SocketContextProps>>({});

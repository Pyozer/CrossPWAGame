import { createContext } from "react";
import { Player } from "../models";

type SocketContextProps = {
    io: SocketIOClient.Socket;
    player: Player;
}

export const SocketContext = createContext<Partial<SocketContextProps>>({});
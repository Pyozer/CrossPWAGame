import React, { useContext } from "react";
import { SocketContext } from "../context/SocketProvider";

const WaitingGame = () => {
    const { player } = useContext(SocketContext);

    return <div className="box">
        <h1 className="title is-1">Hello {player!.nickname} !</h1>
        <h3 className="title is-3">Waiting for another player...</h3>
        <progress className="progress is-large is-info" max="100" />
    </div>
};

export default WaitingGame;

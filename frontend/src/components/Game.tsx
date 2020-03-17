import React, { FunctionComponent, useContext, useEffect, useState } from "react"
import { Message } from "../models/Message"
import { WaitingGame } from "."
import { Link } from "react-router-dom"
import { SocketContext } from "../context/SocketProvider"

type OnEvent = (message: string) => void;
type OnGameEnd = (message: string, winner: boolean) => void;

type GameProps = {
    game: string;
    message?: Message;
    onWinPoint: OnEvent;
    onWin: OnEvent;
    onLosePoint: OnEvent;
    onLose: OnEvent;
    onGameEnd: OnGameEnd;
    onGameForceEnd: OnEvent;
}

export const Game: FunctionComponent<GameProps> = (props) => {
    const [isGameStarted, setGameStarted] = useState(false);
    const [isGameEnd, setGameEnd] = useState<boolean>(false);
    const { io, player } = useContext(SocketContext);

    useEffect(() => {
        io!.on(`${props.game}::gameStart`, () => {
            setGameStarted(true);
        });

        io!.emit('Game::join', props.game)

        io!.on(`${props.game}::winPoint`, () => {
            props.onWinPoint('You win a point !');
        });
        io!.on(`${props.game}::losePoint`, (payload: any) => {
            props.onLosePoint(`You lose this round :/ ${payload.playerName} win a point.`);
        });
        io!.on(`${props.game}::gameEnd`, (status: any) => {
            const isWinner = status === 'win';
            props.onGameEnd(isWinner ? 'You win !' : 'You lose', isWinner);
            setGameEnd(true);
        });
        io!.on(`${props.game}::gameForceEnd`, () => {
            props.onGameForceEnd('Game stopped ! Due to player disconnection');
            setGameEnd(true);
        });
    })

    const displayMessage = (message?: Message) => {
        if (!message) return <></>
        return <div className={`notification is-${message.isSuccess ? 'success' : 'danger'}`}>
            {message.msg}
        </div>
    }

    if (!isGameStarted) return <WaitingGame />

    return <div className="box">
        {displayMessage(props.message)}
        {!isGameEnd && props.children}
        <h5>You have {player?.points} points</h5>
        {isGameEnd && (
            <>
                <br />
                <Link to='/'>Back to games</Link>
            </>
        )}
    </div>
}
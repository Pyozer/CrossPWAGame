import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Message } from "../models/Message";
import { SocketContext } from "../context/SocketProvider";
import { WaitingGame } from "../components";
import { useMessage } from "../hooks";

export const MagicNumber = () => {
  const [isGameStarted, setGameStarted] = useState(false);

  const [playerNumber, setPlayerNumber] = useState('');
  const { message, setSuccessMsg, setErrorMsg } = useMessage();
  const [isGameEnd, setGameEnd] = useState<boolean>(false);
  const { io, player } = useContext(SocketContext);

  useEffect(() => {
    io!.on("magicnumber::gameStart", () => {
      console.log("game started");
      setGameStarted(true);
    });

    io!.emit('Game::join', 'magicnumber')

    io!.on("magicnumber::winPoint", () => {
      setSuccessMsg('You win a point !');
      setPlayerNumber('');
    });
    io!.on("magicnumber::losePoint", (payload: any) => {
      setErrorMsg(`You lose this round :/ ${payload.playerName} win a point.`);
      setPlayerNumber('');
    });
    io!.on("magicnumber::gameEnd", (status: any) => {
      if (status === 'win') {
        setSuccessMsg('You win !');
      } else {
        setErrorMsg('You lose !');
      }
      setPlayerNumber('');
      setGameEnd(true);
    });
    io!.on("magicnumber::gameForceEnd", () => {
      setErrorMsg('Game stopped ! Due to player disconnection');
      setPlayerNumber('');
      setGameEnd(true);
    });
  }, [])

  useEffect(() => {
    io!.once("magicnumber::numberIsLess", () => {
      setErrorMsg(`Number is less than ${playerNumber}!`);
    });
    io!.once("magicnumber::numberIsMore", () => {
      setErrorMsg(`Number is more than ${playerNumber}!`);
    });
  }, [playerNumber])

  const handleNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerNumber(event.target.value);
  };

  const sendNumber = () => {
    console.log(playerNumber);

    if (!playerNumber) return;

    io!.emit("magicnumber::tryNumber", {
      id: player!.id,
      number: parseInt(playerNumber)
    });
  };

  const displayMessage = (message?: Message) => {
    if (!message) return <></>
    return <div className={`notification is-${message.isSuccess ? 'success' : 'danger'}`}>
      {message.msg}
    </div>
  }

  if (!isGameStarted) {
    return <WaitingGame />
  }

  return (
    <div className="box">
      {displayMessage(message)}
      {!isGameEnd && (
        <div className="field">
          <div className="control">
            <input className="input" placeholder="Guess the number (from 0 to 1337)" onChange={handleNumber} value={`${playerNumber}`} />
          </div>
          <div className="control">
            <button className="button is-info" onClick={sendNumber}>
              Send
        </button>
          </div>
        </div>
      )}
      <h5>You have {player?.points} points</h5>
      {isGameEnd && <Link to='/games'>Back to games</Link>}
    </div>
  );
};

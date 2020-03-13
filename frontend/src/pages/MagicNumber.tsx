import React, { useState, useEffect, useContext } from "react";
import Message from "../models/Message";
import { SocketContext } from "../context/SocketProvider";
import WaitingGame from "../components/WaitingGame";

const MagicNumber = () => {
  const [isGameStarted, setGameStarted] = useState(false);

  const [playerNumber, setPlayerNumber] = useState('');
  const [message, setMessage] = useState<Message>();
  const [isGameEnd, setGameEnd] = useState<boolean>(false);
  const { io, player } = useContext(SocketContext);

  useEffect(() => {
    io!.on("magicnumber::gameStart", () => {
      console.log("game started");
      setGameStarted(true);
    });

    io!.emit('Game::join', 'magicnumber')

    io!.on("magicnumber::winPoint", () => {
      setMessage({ msg: 'You win a point !', isSuccess: true });
      setPlayerNumber('');
    });
    io!.on("magicnumber::losePoint", (payload: any) => {
      setMessage({ msg: `You lose this round :/ ${payload.playerName} win a point.`, isSuccess: false });
      setPlayerNumber('');
    });
    io!.on("magicnumber::gameEnd", (status: any) => {
      if (status === 'win') {
        setMessage({ msg: 'You win !', isSuccess: true });
      } else {
        setMessage({ msg: 'You lose !', isSuccess: false });
      }
      setPlayerNumber('');
      setGameEnd(true);
    });
    io!.on("magicnumber::gameForceEnd", () => {
      setMessage({ msg: 'Game stopped ! Due to player disconnection', isSuccess: false });
      setPlayerNumber('');
      setGameEnd(true);
    });
  }, [])

  useEffect(() => {
    io!.once("magicnumber::numberIsLess", () => {
      setMessage({ msg: `Number is less than ${playerNumber}!`, isSuccess: false });
    });
    io!.once("magicnumber::numberIsMore", () => {
      setMessage({ msg: `Number is more than ${playerNumber}!`, isSuccess: false });
    });
  }, [playerNumber, io])

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
    </div>
  );
};

export default MagicNumber;

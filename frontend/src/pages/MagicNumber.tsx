import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketProvider";
import { useMessage } from "../hooks";
import { Game } from "../components";

export const MagicNumber = () => {
  const [playerNumber, setPlayerNumber] = useState('');
  const { message, setErrorMsg, setSuccessMsg, setMessage } = useMessage();
  const { io, player } = useContext(SocketContext);

  const setSuccessMsgAndReset = (msg: string) => {
    setSuccessMsg(msg);
    setPlayerNumber('');
  }
  const setErrorMsgAndReset = (msg: string) => {
    setErrorMsg(msg);
    setPlayerNumber('');
  }
  const onGameEnd = (msg: string, winner: boolean) => {
    setMessage({ msg, isSuccess: winner })
    setPlayerNumber('');
  }

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
    if (!playerNumber) return;
    io!.emit("magicnumber::tryNumber", {
      id: player!.id,
      number: parseInt(playerNumber)
    });
  };

  return <Game
    game="magicnumber"
    message={message}
    onWinPoint={setSuccessMsgAndReset}
    onWin={setSuccessMsgAndReset}
    onLosePoint={setErrorMsgAndReset}
    onLose={setErrorMsgAndReset}
    onGameEnd={onGameEnd}
    onGameForceEnd={setErrorMsgAndReset}
  >
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
  </Game>
};

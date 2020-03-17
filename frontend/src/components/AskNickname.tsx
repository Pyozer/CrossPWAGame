import React, { useContext } from "react";
import { SocketContext } from "../context/SocketProvider";
import { useInput } from "../hooks";

export const AskNickname = () => {
  const { input: nickname, onInputChange: onNicknameChange } = useInput();
  const { io } = useContext(SocketContext);

  const sendNickname = () => {
    io!.emit("Game::sendNickname", nickname);
  };

  return (
    <div className="field">
      <div className="control">
        <input className="input" placeholder="Write your nickname" onChange={onNicknameChange} value={nickname} />
      </div>
      <div className="control">
        <button className="button is-info" onClick={sendNickname}>Send</button>
      </div>
    </div>
  );
};

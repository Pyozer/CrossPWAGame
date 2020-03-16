import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketProvider";

const AskNickname = () => {
  const [nickname, setNickname] = useState("");
  const { io } = useContext(SocketContext);

  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const sendNickname = () => {
    io!.emit("Game::sendNickname", nickname);
  };

  return (
    <div className="field">
      <div className="control">
        <input className="input" placeholder="Write your nickname" onChange={handleNickname} value={nickname} />
      </div>
      <div className="control">
        <button className="button is-info" onClick={sendNickname}>Send</button>
      </div>
    </div>
  );
};

export default AskNickname;

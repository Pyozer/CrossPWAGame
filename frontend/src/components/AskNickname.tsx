import React, { useState, FunctionComponent } from "react";

type AskNicknameProps = {
  onChange: (nickname: string) => void;
}

const AskNickname: FunctionComponent<AskNicknameProps> = ({ onChange }) => {
  const [nickname, setNickname] = useState("");

  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const sendNickname = () => onChange(nickname);

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

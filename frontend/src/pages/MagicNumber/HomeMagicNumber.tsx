import React, { useState, useEffect, useContext } from "react";
import AskNickname from "../../components/AskNickname";
import MagicNumber from "./MagicNumber";
import WaitingGame from "../../components/WaitingGame";
import { SocketContext } from "../../context/SocketProvider";

const HomeMagicNumber = () => {
  const [isGameStarted, setGameStarted] = useState(false);
  const { io, player, updatePlayer } = useContext(SocketContext);

  useEffect(() => {
    io!.on("magicnumber::hello", () => {
      console.log("handshake");
    });

    io!.on("magicnumber::gameStart", () => {
      console.log("game started");
      setGameStarted(true);
    });

    io!.on("magicnumber::playerInfo", (payload: any) => {
      updatePlayer!(payload);
    });
  }, [])

  if (isGameStarted && player) {
    return <MagicNumber />
  }
  if (!player) {
    return <AskNickname />
  }
  return <WaitingGame />
};

export default HomeMagicNumber;

import React, { useState, useEffect } from "react";
import AskNickname from "./components/AskNickname";
import MagicNumber from "./components/MagicNumber";
import WaitingGame from "./components/WaitingGame";
import { SocketContext } from "./context/SocketProvider";
import socketIO from 'socket.io-client';
import { Player } from "./models";

const io = socketIO("http://localhost:80")

const App = () => {
  const [isGameStarted, setGameStarted] = useState(false);
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    io.on("magicnumber::hello", () => {
      console.log("handshake");
    });

    io.on("magicnumber::gameStart", () => {
      console.log("game started");
      setGameStarted(true);
    });

    io.on("magicnumber::playerInfo", (payload: any) => {
      setPlayer(payload);
    });
  }, [])

  const renderBody = () => {
    if (isGameStarted && player) {
      return <MagicNumber />
    }
    if (!player) {
      return <AskNickname />
    }
    return <WaitingGame />
  }

  return (
    <SocketContext.Provider value={{ io, player }}>
      <section className="hero is-fullheight is-light">
        <div className="hero-head">
          <div className="container">
            <div className="tabs is-centered">
              <ul>
                <li>
                  <a>PWA Games</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="hero-body">
          <div className="container">
            <header className="bd-index-header">
              {renderBody()}
            </header>
          </div>
        </div>

        <div className="hero-foot">
          <div className="container">
            <div className="tabs is-centered">
              <ul>
                <li>
                  <a>Let's Rock!</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SocketContext.Provider>
  );
};

export default App;

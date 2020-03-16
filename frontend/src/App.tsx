import React, { useState, useEffect } from "react";
import { SocketContext } from "./context/SocketProvider";
import socketIO from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import MagicNumber from "./pages/MagicNumber";
import Home from "./pages/Home";
import Player from "./models/Player";
import AskNickname from "./components/AskNickname";

const io = socketIO("https://crosspwagame.herokuapp.com/")

const App = () => {
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    io.on('Game::playerInfo', (player: any) => {
      console.log("On playerInfo", player);
      
      updatePlayer(player)
    });
  }, []);

  const updatePlayer = (player?: Player) => {
    setPlayer(player);
  }

  return (
    <Router basename='/CrossPWAGame'>
      <SocketContext.Provider value={{ io, player, updatePlayer }}>
        <section className="hero is-fullheight is-light">
          <div className="hero-head">
            <div className="container">
              <div className="tabs is-centered">
                <ul>
                  <li>
                    <Link to='/'>PWA Games</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="hero-body">
            <div className="container">
              <header className="bd-index-header">
                {!player ? (
                  <AskNickname />
                ) : (
                    <Switch>
                      <Route exact path="/">
                        <Home />
                      </Route>
                      <Route path="/magicnumber">
                        <MagicNumber />
                      </Route>
                    </Switch>
                  )}
              </header>
            </div>
          </div>

          <div className="hero-foot">
            <div className="container">
              <div className="tabs is-centered">
                <ul>
                  <li>Let's Rock!</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </SocketContext.Provider >
    </Router >
  );
};

export default App;

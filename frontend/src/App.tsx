import React, { useState, useEffect } from "react";
import { SocketContext, SocketContextProps } from "./context/SocketProvider";
import socketIO from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import HomeMagicNumber from "./pages/MagicNumber/HomeMagicNumber";
import Home from "./pages/Home";
import Player from "./models/Player";

const io = socketIO("http://localhost:80")

const App = () => {
  const [player, setPlayer] = useState<Player>();

  const updatePlayer = (player?: Player) => {
    setPlayer(player);
  }

  return (
    <Router>
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
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <Route path="/magicnumber">
                    <HomeMagicNumber />
                  </Route>
                </Switch>
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
      </SocketContext.Provider>
    </Router>
  );
};

export default App;

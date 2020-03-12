import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";

type GameCardProps = {
    title: string;
    desc: string;
    pathGame: string;
}
const GameCard: FunctionComponent<GameCardProps> = (props) => {
    return <div className="card">
        <header className="card-header">
            <p className="card-header-title">{props.title}</p>
        </header>
        <div className="card-content">
            <div className="content">{props.desc}</div>
            <footer className="card-footer">
                <Link to={props.pathGame} className="card-footer-item">Play</Link>
            </footer>
        </div>
    </div>
}

export default GameCard;
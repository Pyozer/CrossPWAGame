import React from 'react';
import { GameCard } from '../components';

export const Home = () => (
    <div className="columns">
        <div className="column">
            <GameCard
                title='MagicNumber'
                desc='You have to find the random MagicNumber generated, by trying some numbers.'
                pathGame='/magicnumber'
            />
        </div>
        <div className="column">
            <GameCard
                title='MagicNumber'
                desc='You have to find the random MagicNumber generated, by trying some numbers.'
                pathGame='/magicnumber'
            />
        </div>
        <div className="column">
            <GameCard
                title='MagicNumber'
                desc='You have to find the random MagicNumber generated, by trying some numbers.'
                pathGame='/magicnumber'
            />
        </div>
    </div>
);

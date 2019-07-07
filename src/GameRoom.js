import React from 'react';
import NavbarGameRoom from './NavbarGameRoom';
import GameCards from './GameCards';
import GameScoreboard from './GameScoreboard';
import GameChat from './GameChat';

class GameRoom extends React.Component {
  render() {
    return (
      <div className='GameRoom'>
        <NavbarGameRoom redirectOnLeaveTo="/dashboard" />
        <GameCards />
        <div className="bottom-section">
          <GameScoreboard />
          <GameChat />
        </div>
      </div>
    );
  }
}

export default GameRoom;
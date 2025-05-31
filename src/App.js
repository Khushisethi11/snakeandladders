import React, { useState } from "react";
import Board from "./Board";

const App = () => {
  const n = 10;
  const [playerPos, setPlayerPos] = useState(1);

  // Snakes and ladders positions
  const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
  };

  const ladders = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
  };

  // Roll dice handler
  const rollDice = () => {
    const dice = Math.floor(Math.random() * 6) + 1;
    let nextPos = playerPos + dice;
    if (nextPos > n * n) nextPos = playerPos;

    if (snakes[nextPos]) nextPos = snakes[nextPos];
    else if (ladders[nextPos]) nextPos = ladders[nextPos];

    setPlayerPos(nextPos);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h1>Snake and Ladder Game</h1>
      <Board playerPos={playerPos} />

      {/* <p>Player is on: {playerPos}</p> */}
    </div>
  );
};

export default App;

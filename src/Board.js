import React, { useState } from "react";

const n = 10;

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

const cellSize = 50;

function get2d(val) {
  const rowFromTop = Math.floor((val - 1) / n);
  const rowFromBottom = n - 1 - rowFromTop;
  let col = (val - 1) % n;

  // Zigzag pattern per row
  if (
    (n % 2 === 0 && rowFromBottom % 2 === 0) ||
    (n % 2 === 1 && rowFromBottom % 2 === 1)
  ) {
    col = n - 1 - col;
  }
  return { row: rowFromBottom, col };
}

export default function App() {
  const [playerPos, setPlayerPos] = useState(1);
  const [diceRoll, setDiceRoll] = useState(1); // default dice image shows 1 initially
  const [message, setMessage] = useState("");

  const getPlayerCoords = (pos) => {
    const { row, col } = get2d(pos);
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    };
  };

  const rollDice = () => {
    if (playerPos === 100) {
      setMessage("Game already won! Refresh to play again.");
      return;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    let newPos = playerPos + roll;

    if (newPos > 100) {
      newPos = playerPos;
      setMessage(`Rolled ${roll}. Need exact roll to reach 100.`);
    } else if (snakes[newPos]) {
      newPos = snakes[newPos];
      setMessage(`Rolled ${roll}. Bitten by a snake! Down to ${newPos}`);
    } else if (ladders[newPos]) {
      newPos = ladders[newPos];
      setMessage(`Rolled ${roll}. Climbed a ladder! Up to ${newPos}`);
    } else {
      setMessage(`Rolled ${roll}. Moved to ${newPos}`);
    }

    setDiceRoll(roll); // update dice image to the rolled number
    setPlayerPos(newPos);

    if (newPos === 100) {
      setMessage("🎉 Congratulations! You won the game!");
    }
  };

  // Prepare board cells in 2D array
  const cells = [];
  for (let val = 1; val <= n * n; val++) {
    const { row, col } = get2d(val);
    if (!cells[row]) cells[row] = [];
    cells[row][col] = val;
  }

  const arrowSize = 6;
  const strokeWidth = 1.5;

  const arrowMarkerIdSnake = "arrowhead-snake";
  const arrowMarkerIdLadder = "arrowhead-ladder";

  const arrowMarkerDefs = (
    <defs>
      {/* Snake arrow */}
      <marker
        id={arrowMarkerIdSnake}
        markerWidth={arrowSize}
        markerHeight={arrowSize}
        refX="0"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L0,6 L6,3 z" fill="red" />
      </marker>

      {/* Ladder arrow, points up */}
      <marker
        id={arrowMarkerIdLadder}
        markerWidth={arrowSize}
        markerHeight={arrowSize}
        refX="3"
        refY="6"
        orient="auto-start-reverse"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L6,3 L0,6 z" fill="green" />
      </marker>
    </defs>
  );

  const getCellCenter = (val) => {
    const { row, col } = get2d(val);
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    };
  };

  const renderSnakes = () =>
    Object.entries(snakes).map(([head, tail]) => {
      const start = getCellCenter(Number(head));
      const end = getCellCenter(tail);
      return (
        <g key={"snake" + head}>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="red"
            strokeWidth={strokeWidth}
            markerEnd={`url(#${arrowMarkerIdSnake})`}
          />
          <text
            x={start.x}
            y={start.y - 10}
            fill="red"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
          >
            🐍
          </text>
          <text
            x={end.x}
            y={end.y + 20}
            fill="red"
            fontSize="14"
            textAnchor="middle"
          >
            🐛
          </text>
        </g>
      );
    });

  const renderLadders = () =>
    Object.entries(ladders).map(([bottom, top]) => {
      const start = getCellCenter(Number(bottom));
      const end = getCellCenter(top);
      return (
        <g key={"ladder" + bottom}>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="green"
            strokeWidth={strokeWidth}
            markerEnd={`url(#${arrowMarkerIdLadder})`}
          />
          <text
            x={start.x}
            y={start.y + 20}
            fill="green"
            fontSize="16"
            textAnchor="middle"
          >
            🪜
          </text>
          <text
            x={end.x}
            y={end.y - 6}
            fill="green"
            fontSize="16"
            textAnchor="middle"
          ></text>
        </g>
      );
    });

  const playerCoords = getPlayerCoords(playerPos);

  // Dice image src based on roll (dice1.jpg ... dice6.jpg)
  // Adjust the path to your images accordingly
  const diceImgSrc = diceRoll ? `/dice${diceRoll}.jpg` : `/dice1.jpg`; // fallback to dice1.jpg

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        marginTop: 20,
        userSelect: "none",
      }}
    >
      {/* Board container */}
      <div
        style={{
          position: "relative",
          width: cellSize * n,
          height: cellSize * n,
          margin: "auto",
          border: "3px solid black",
          backgroundColor: "#f5f5dc",
        }}
      >
        {/* Board cells grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${n}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${n}, ${cellSize}px)`,
            width: cellSize * n,
            height: cellSize * n,
            userSelect: "none",
          }}
        >
          {cells.flat().map((cellNum) => {
            return (
              <div
                key={cellNum}
                style={{
                  border: "1px solid #888",
                  boxSizing: "border-box",
                  fontSize: 12,
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: `${cellSize}px`,
                  backgroundColor:
                    (Math.floor((cellNum - 1) / n) + cellNum) % 2 === 0
                      ? "#fff"
                      : "#ddd",
                  position: "relative",
                  userSelect: "none",
                }}
              >
                {cellNum}
              </div>
            );
          })}
        </div>

        {/* SVG overlays for snakes and ladders */}
        <svg
          width={cellSize * n}
          height={cellSize * n}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          {arrowMarkerDefs}
          {renderSnakes()}
          {renderLadders()}
        </svg>

        {/* Player token */}
        <div
          style={{
            position: "absolute",
            left: playerCoords.x - 15,
            top: playerCoords.y - 15,
            width: 30,
            height: 30,
            backgroundColor: "blue",
            borderRadius: "50%",
            border: "3px solid white",
            boxShadow: "0 0 10px rgba(0,0,255,0.7)",
            transition: "left 0.4s ease, top 0.4s ease",
            userSelect: "none",
          }}
        />
      </div>

      {/* Dice and message container below board */}
      <div
        style={{
          marginTop: 15,
          userSelect: "none",
          minWidth: cellSize * n,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Dice button with image */}
        <button
          onClick={rollDice}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            cursor: "pointer",
            userSelect: "none",
            marginBottom: 10,
            border: "none",
            padding: 0,
            backgroundColor: "transparent",
            outline: "none",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
          }}
          aria-label="Roll Dice"
        >
          <img
            src={diceImgSrc}
            // alt={`Dice showing ${diceRoll}`}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
            draggable={false}
          />
        </button>

        {/* Message showing roll and status */}
        <div
          style={{
            fontSize: 16,
            fontWeight: "bold",
            minHeight: 24,
            marginBottom: 10,
            color: message.includes("won") ? "green" : "black",
            minWidth: 250,
            margin: "auto",
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
}

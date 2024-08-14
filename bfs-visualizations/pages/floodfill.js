import React, { useState } from 'react';
import "../app/globals.css"; // Ensure TailwindCSS is imported

export default function FloodFillComponent() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [numLandTiles, setNumLandTiles] = useState(3);
  const [sr, setSr] = useState(0);
  const [sc, setSc] = useState(0);
  const [image, setImage] = useState(generateRandomGrid(rows, cols, numLandTiles));
  const [floodFillState, setFloodFillState] = useState(null);

  const handleInitialize = () => {
    const initialState = initializeFloodFill(image, sr, sc, 2);
    if (initialState) {
      setFloodFillState(initialState);
    }
  };

  const handleStep = () => {
    if (floodFillState) {
      const nextState = floodFillStep(floodFillState);
      if (nextState) {
        setFloodFillState(nextState);
        setImage([...nextState.image]);
      } else {
        alert("Flood fill complete");
      }
    }
  };

  const handleRandomize = () => {
    const newGrid = generateRandomGrid(rows, cols, numLandTiles);
    setImage(newGrid);
    setFloodFillState(null); // Reset any ongoing flood fill
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Flood Fill Visualization</h1>

      <div className="space-y-2">
        <label className="flex flex-col">
          <span>Rows:</span>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value, 10))}
            className="border border-gray-300 p-2 rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Columns:</span>
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value, 10))}
            className="border border-gray-300 p-2 rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Number of Land Tiles:</span>
          <input
            type="number"
            value={numLandTiles}
            onChange={(e) => setNumLandTiles(parseInt(e.target.value, 10))}
            className="border border-gray-300 p-2 rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Start Row:</span>
          <input
            type="number"
            value={sr}
            onChange={(e) => setSr(parseInt(e.target.value, 10))}
            className="border border-gray-300 p-2 rounded"
          />
        </label>
        <label className="flex flex-col">
          <span>Start Column:</span>
          <input
            type="number"
            value={sc}
            onChange={(e) => setSc(parseInt(e.target.value, 10))}
            className="border border-gray-300 p-2 rounded"
          />
        </label>

      <div className="flex flex-col items-center mt-4">
        {image.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((pixel, colIndex) => (
              <div
                key={colIndex}
                className={`w-20 h-20 border border-gray-400 m-0.5 ${pixel === 1 ? 'bg-white' : pixel === 0 ? 'bg-black' : 'bg-blue-500'}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
          <button
            onClick={handleRandomize}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Randomize Grid
          </button>
          <button
            onClick={handleInitialize}
            disabled={floodFillState !== null}
            className={`px-4 py-2 rounded ${floodFillState !== null ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            Initialize Flood Fill
          </button>
          <button
            onClick={handleStep}
            disabled={floodFillState === null}
            className={`px-4 py-2 rounded ${floodFillState === null ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}

// Function to generate a random grid with a given number of land tiles
function generateRandomGrid(rows, cols, numLandTiles) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  let placedTiles = 0;

  while (placedTiles < numLandTiles) {
    const x = Math.floor(Math.random() * rows);
    const y = Math.floor(Math.random() * cols);

    // Place a land tile if the spot is empty
    if (grid[x][y] === 0) {
      grid[x][y] = 1;
      placedTiles++;
    }
  }

  return grid;
}

// Reuse the flood fill step-by-step functions
function initializeFloodFill(image, sr, sc, newColor) {
  const originalColor = image[sr][sc];
  
  if (originalColor === newColor) {
    return null;
  }

  const m = image.length;
  const n = image[0].length;

  const queue = [[sr, sc]];

  return {
    image,
    queue,
    directions: [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ],
    newColor,
    originalColor,
    m,
    n,
  };
}

function floodFillStep(state) {
  const { image, queue, directions, newColor, originalColor, m, n } = state;

  if (queue.length === 0) {
    return null;
  }

  const [x, y] = queue.shift();
  
  if (image[x][y] === originalColor) {
    image[x][y] = newColor;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < m && ny >= 0 && ny < n && image[nx][ny] === originalColor) {
        queue.push([nx, ny]);
      }
    }
  }

  return { ...state, image, queue };
}

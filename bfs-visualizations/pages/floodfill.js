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
    if (sr >= 0 && sr < rows && sc >= 0 && sc < cols) {
      const initialState = initializeFloodFill(image, sr, sc, 2);
      if (initialState) {
        setFloodFillState(initialState);
      }
    } else {
      alert("Starting coordinates are out of bounds.");
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

  const handleRowsChange = (e) => {
    const newRows = parseInt(e.target.value, 10);
    if (newRows >= 3 && newRows <= 10) {
      setRows(newRows);
      setImage(generateRandomGrid(newRows, cols, numLandTiles));
      if (sr >= newRows) setSr(newRows - 1);
    }
  };

  const handleColsChange = (e) => {
    const newCols = parseInt(e.target.value, 10);
    if (newCols >= 3 && newCols <= 10) {
      setCols(newCols);
      setImage(generateRandomGrid(rows, newCols, numLandTiles));
      if (sc >= newCols) setSc(newCols - 1);
    }
  };

  const handleNumLandTilesChange = (e) => {
    const newLandTiles = parseInt(e.target.value, 10);
    if (newLandTiles >= 0 && newLandTiles <= (rows * cols - 1)) {
      setNumLandTiles(newLandTiles);
      setImage(generateRandomGrid(rows, cols, newLandTiles));
    }
  };

  const handleStartRowChange = (e) => {
    const newStartRow = parseInt(e.target.value, 10);
    if (newStartRow >= 0 && newStartRow < rows) {
      setSr(newStartRow);
    }
  };

  const handleStartColChange = (e) => {
    const newStartCol = parseInt(e.target.value, 10);
    if (newStartCol >= 0 && newStartCol < cols) {
      setSc(newStartCol);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Flood Fill Visualization</h1>

      {/* Environmental inputs */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm font-medium">Rows:</label>
          <input
            type="number"
            value={rows}
            onChange={handleRowsChange}
            className="text-black border border-gray-300 p-2 rounded w-24"
            min="3"
            max="10"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm font-medium">Columns:</label>
          <input
            type="number"
            value={cols}
            onChange={handleColsChange}
            className="text-black border border-gray-300 p-2 rounded w-24"
            min="3"
            max="10"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm font-medium">Number of Land Tiles:</label>
          <input
            type="number"
            value={numLandTiles}
            onChange={handleNumLandTilesChange}
            className="text-black border border-gray-300 p-2 rounded w-24"
            min="0"
            max={rows * cols - 1}
          />
        </div>
      </div>

      {/* Start row and column */}
      <div className="flex flex-col items-center mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <label className="mb-1 text-sm font-medium">Start Row:</label>
            <input
              type="number"
              value={sr}
              onChange={handleStartRowChange}
              className="text-black border border-gray-300 p-2 rounded w-24"
              min="0"
              max={rows - 1}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="mb-1 text-sm font-medium">Start Column:</label>
            <input
              type="number"
              value={sc}
              onChange={handleStartColChange}
              className="text-black border border-gray-300 p-2 rounded w-24"
              min="0"
              max={cols - 1}
            />
          </div>
        </div>

      {/* Grid code */}
      <div className="flex flex-col items-center mt-4">
        {image.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((pixel, colIndex) => (
              <div
                key={colIndex}
                className={`w-10 h-10 border border-gray-400 m-0.5 ${pixel === 1 ? 'bg-white' : pixel === 0 ? 'bg-black' : 'bg-blue-500'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* Buttons for starting code */}
    <div className="grid grid-cols-3 gap-4 mt-4">
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

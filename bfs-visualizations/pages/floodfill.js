import React, { useState, useEffect } from 'react';
import "../app/globals.css"; // Ensure TailwindCSS is imported

export default function FloodFill() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [numMtnTiles, setNumMtnTiles] = useState(5);
  const [sr, setSr] = useState(0);
  const [sc, setSc] = useState(0);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [image, setImage] = useState([]);
  const [floodFillState, setFloodFillState] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setImage(generateRandomGrid(rows, cols, numMtnTiles));
  }, [rows, cols, numMtnTiles]);

  const handleInitialize = () => {
    if (sr >= 0 && sr < rows && sc >= 0 && sc < cols) {
      const initialState = initializeFloodFill(image, sr, sc, 2);
      if (initialState) {
        setFloodFillState(initialState);
        setIsInitialized(true); // Show "Next Step" button and hide "Initialize Flood Fill" button
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
        setIsComplete(true);
        alert("Flood fill complete");
      }
    }
  };

  const resetTiles = (r, c, mtns) => {
    setImage(generateRandomGrid(r, c, mtns));
    setFloodFillState(null); // Reset flood fill state
    setSelectedCell({ row: null, col: null }); // Reset selected cell
    setIsInitialized(false); // Reset button visibility on randomize
    setIsComplete(false); // Ensure "Next Step" is re-enabled
  }

  const handleRandomize = () => {
    resetTiles(rows, cols, numMtnTiles);
  };

  const incrementRows = () => {
    if (rows < 10) {
      const newRows = rows + 1;
      setRows(newRows);
      resetTiles(newRows, cols, numMtnTiles);
      if (sr >= newRows) setSr(newRows - 1);
    }
  };

  const decrementRows = () => {
    if (rows > 3) {
      const newRows = rows - 1;
      setRows(newRows);
      resetTiles(newRows, cols, numMtnTiles);
      if (sr >= newRows) setSr(newRows - 1);
    }
  };

  const incrementCols = () => {
    if (cols < 10) {
      const newCols = cols + 1;
      setCols(newCols);
      resetTiles(rows, newCols, numMtnTiles);
      if (sc >= newCols) setSc(newCols - 1);
    }
  };

  const decrementCols = () => {
    if (cols > 3) {
      const newCols = cols - 1;
      setCols(newCols);
      resetTiles(rows, newCols, numMtnTiles);
      if (sc >= newCols) setSc(newCols - 1);
    }
  };

  const incrementMtnTiles = () => {
    if (numMtnTiles < rows * cols - 1) {
      const newMtnTiles = numMtnTiles + 1;
      setNumMtnTiles(newMtnTiles);
      resetTiles(rows, cols, newMtnTiles);
    }
  };

  const decrementMtnTiles = () => {
    if (numMtnTiles > 0) {
      const newMtnTiles = numMtnTiles - 1;
      setNumMtnTiles(newMtnTiles);
      resetTiles(rows, cols, newMtnTiles);
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    console.log(image)
    console.log(image[rowIndex][colIndex])
    if (image[rowIndex][colIndex] === 0) {
      setSr(rowIndex);
      setSc(colIndex);
      setSelectedCell({ row: rowIndex, col: colIndex });
    }
  };

  console.log(selectedCell);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Flood Fill Visualization</h1>

      {/* Grid configuration controls */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Rows control */}
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm font-medium">Rows:</label>
          <div className="flex items-center">
            <button onClick={decrementRows} className="bg-gray-300 text-black px-2 py-1 rounded-s hover:bg-gray-400">-</button>
            <span className="bg-gray-300 px-4 py-1 text-black">{rows}</span>
            <button onClick={incrementRows} className="bg-gray-300 text-black px-2 py-1 rounded-e hover:bg-gray-400">+</button>
          </div>
        </div>
        {/* Columns control */}
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm font-medium">Columns:</label>
          <div className="flex items-center">
            <button onClick={decrementCols} className="bg-gray-300 text-black px-2 py-1 rounded-s hover:bg-gray-400">-</button>
            <span className="bg-gray-300 px-4 py-1 text-black">{cols}</span>
            <button onClick={incrementCols} className="bg-gray-300 text-black px-2 py-1 rounded-e hover:bg-gray-400">+</button>
          </div>
        </div>
        {/* Number of mountain tiles control */}
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm font-medium">Number of Mountain Tiles:</label>
          <div className="flex items-center">
            <button onClick={decrementMtnTiles} className="bg-gray-300 text-black px-2 py-1 rounded-s hover:bg-gray-400">-</button>
            <span className="bg-gray-300 px-4 py-1 text-black">{numMtnTiles}</span>
            <button onClick={incrementMtnTiles} className="bg-gray-300 text-black px-2 py-1 rounded-e hover:bg-gray-400">+</button>
          </div>
        </div>
      </div>

      {/* Grid visualization */}
      <div className="flex flex-col items-center mt-4">
        {image.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((pixel, colIndex) => (
              <div
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-14 h-14 border border-gray-400 hover:border-white hover:border-2 m-0.5 ${pixel === 1 ? 'bg-white' : pixel === 0 ? 'bg-black' : 'bg-blue-500'} ${selectedCell.row === rowIndex && selectedCell.col === colIndex ? 'border-4 border-yellow-500 hover:border-4 hover:border-yellow-500' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Starting coordinates display */}
      <div className="flex flex-col items-center mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <label className="mb-1 text-sm font-medium">Start Row:</label>
            <span className="text-black bg-white border border-gray-300 p-2 rounded w-24">{sr}</span>
          </div>
          <div className="flex flex-col items-center">
            <label className="mb-1 text-sm font-medium">Start Column:</label>
            <span className="text-black bg-white border border-gray-300 p-2 rounded w-24">{sc}</span>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={handleRandomize}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Randomize Grid
        </button>

        {!isInitialized && (
          <button
            onClick={handleInitialize}
            disabled={isInitialized || selectedCell.row === null || selectedCell.col === null}
            className={`px-4 py-2 rounded ${floodFillState !== null ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            Initialize Flood Fill
          </button>
        )}
        {isInitialized && (
          <button
            onClick={handleStep}
            disabled={isComplete}
            className={`px-4 py-2 rounded ${floodFillState === null ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
          >
            Next Step
          </button>
        )}
      </div>
    </div>
  );
}

// Function to generate a random grid with a given number of mountain tiles
function generateRandomGrid(rows, cols, numMtnTiles) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  let placedTiles = 0;

  while (placedTiles < numMtnTiles) {
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

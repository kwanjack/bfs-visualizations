import React, { useState, useEffect } from 'react';
import "../app/globals.css"; // Ensure TailwindCSS is imported
import { useSprings, animated } from '@react-spring/web'

export default function FloodFill() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [numMtnTiles, setNumMtnTiles] = useState(5);
  const [sr, setSr] = useState(0);
  const [sc, setSc] = useState(0);
  const [startRow, setStartRow] = useState(0);
  const [startCol, setStartCol] = useState(0);
  const [selectedTile, setSelectedTile] = useState({ row: null, col: null });
  const [image, setImage] = useState([]);
  const [floodFillState, setFloodFillState] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    setImage(generateRandomGrid(rows, cols, numMtnTiles));
  }, [rows, cols, numMtnTiles]);

  const handleInitialize = () => {
    if (sr >= 0 && sr < rows && sc >= 0 && sc < cols) {
      const initialState = initializeFloodFill(image, sr, sc, 2);
      console.log(initialState);
      if (initialState) {
        setStartRow(sr);
        setStartCol(sc);
        setFloodFillState(initialState);
        setIsInitialized(true); // Show "Next Step" button and hide "Initialize Flood Fill" button
        setQueue([...initialState.queue]); // Set the initial queue
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
        setQueue([...nextState.queue]); // Update the queue
        console.log(queue);
      } else {
        setIsComplete(true);
      }
    }
  };

  const resetTiles = (r, c, mtns) => {
    setImage(generateRandomGrid(r, c, mtns));
    setFloodFillState(null); // Reset flood fill state
    setSelectedTile({ row: null, col: null }); // Reset selected tile
    setIsInitialized(false); // Reset button visibility on reset
    setIsComplete(false); // Ensure "Next Step" is re-enabled
    setStartRow(0);
    setStartCol(0);
    setQueue([]); // Clear the queue
  }

  const handleDefaultReset = () => {
    resetTiles(rows, cols, numMtnTiles);
  };

  const handleRowsChange = (event) => {
    const newRows = parseInt(event.target.value);
    if(numMtnTiles >= newRows * cols) {
      const newMtnTiles = newRows * cols - 1;
      setNumMtnTiles(newMtnTiles);
    }
    setRows(newRows);
    resetTiles(newRows, cols, numMtnTiles);
    if (sr >= newRows) setSr(newRows - 1);
  };

  const handleColsChange = (event) => {
    const newCols = parseInt(event.target.value);
    if(numMtnTiles >= newCols * rows) {
      const newMtnTiles = newCols * rows - 1;
      setNumMtnTiles(newMtnTiles);
    }
    setCols(newCols);
    resetTiles(rows, newCols, numMtnTiles);
    if (sc >= newCols) setSc(newCols - 1);
  };

  const handleMtnTilesChange = (event) => {
    const newMtnTiles = parseInt(event.target.value);
    setNumMtnTiles(newMtnTiles);
    resetTiles(rows, cols, newMtnTiles);
  };

  const handleTileClick = (rowIndex, colIndex) => {
    if (image[rowIndex][colIndex] === 0) {
      setSr(rowIndex);
      setSc(colIndex);
      setSelectedTile({ row: rowIndex, col: colIndex });
    }
  };

  const springs = useSprings(
    image.flat().length, // Total number of divs
    image.flat().map((pixel, index) => ({
      from: { height: '0%' },
      to: { height: pixel === 2 ? '100%' : '0%' },
      config: { duration: 500 },
    }))
  );


  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Flood Fill BFS Visualizer</h1>

      <div className="w-full grid grid-cols-3 gap-4">
        {/* Grid configuration controls */}
        <div className="flex-col mr-8 inline-block items-left">
          {/* Rows control */}
          <div className="flex flex-col items-center pb-10">
            <label className="mb-1 text-xl font-medium">Rows: {rows}</label>
            <input
              type="range"
              min="3"
              max="10"
              value={rows}
              onChange={handleRowsChange}
              className="w-64 accent-red-300"
            />
          </div>
          {/* Columns control */}
          <div className="flex flex-col items-center pb-10">
            <label className="mb-1 text-xl font-medium">Columns: {cols}</label>
            <input
              type="range"
              min="3"
              max="10"
              value={cols}
              onChange={handleColsChange}
              className="w-64 accent-blue-300"
            />
          </div>
          {/* Number of mountain tiles control */}
          <div className="flex flex-col items-center">
            <label className="mb-1 text-xl font-medium">Mountain Tiles: {numMtnTiles}</label>
            <input
              type="range"
              min="0"
              max={rows * cols - 1}
              value={numMtnTiles}
              onChange={handleMtnTilesChange}
              className="w-64 accent-gray-400"
            />
          </div>
        </div>

        {/* Grid visualization */}
        <div className="flex flex-col items-center mt-4">
          {image.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((pixel, colIndex) => {
                const index = rowIndex * cols + colIndex;
                return (
                  <animated.div 
                    key={index}
                    onClick={() => handleTileClick(rowIndex, colIndex)}
                    className={`w-12 h-12 border border-gray-400 m-1 transform transition-transform duration-300 hover:scale-110 ${
                      pixel === 1 ? 'bg-white' : 'bg-black'
                    } ${(!isInitialized && selectedTile.row === rowIndex && selectedTile.col === colIndex) || 
                          (isInitialized && rowIndex === startRow && colIndex === startCol) ? 'border-yellow-500' : ''}`}
                  >
                    <animated.div 
                      style={{ ...springs[index] }}
                      className="absolute bottom-0 left-0 bg-blue-400 w-full"
                    />
                  </animated.div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center ml-8">
          {queue.length > 0 ? (
            <div>
              <div className='pb-4'>
                <h2 className="text-2xl">Current:</h2>
                <p className='text-xl'>
                  ({queue[0][0]}, {queue[0][1]})
                </p>
              </div>
              <div>
                <h2 className="text-2xl">Next:</h2>
                <ul className="text-l">
                  {queue.slice(1, Math.floor(Math.max(7, rows * cols / 6))).map((tile, index) => (
                    <li key={index}>({tile[0]}, {tile[1]})</li>
                  ))}
                  {queue.length > Math.floor(Math.max(8, rows * cols / 6)) ? <li>...</li> : ''}
                </ul>
              </div>
            </div>
          ) : isComplete ? (
            <p className='text-2xl'>Completed.</p>
          ) : (
            <p className='text-2xl'>None.</p>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={handleDefaultReset}
          className="bg-transparent text-white px-4 py-2 rounded border-2 border-gray-500 hover:border-white"
        >
          Reset
        </button>

        {!isInitialized && (
          <button
            onClick={handleInitialize}
            disabled={isInitialized || selectedTile.row === null || selectedTile.col === null}
            className={`px-4 py-2 w-36 rounded ${floodFillState !== null ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-transparent text-white border-2 border-yellow-700 hover:border-yellow-500'}`}
          >
            Start
          </button>
        )}
        {isInitialized && (
          <button
            onClick={handleStep}
            disabled={isComplete}
            className={`px-4 py-2 w-36 rounded ${floodFillState === null ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-transparent text-white border-2 border-blue-800 hover:border-blue-500'}`}
          >
            Step
          </button>
        )}
      </div>
    </div>
  );
}

// Function to generate a random grid with a given number of mountain tiles
function generateRandomGrid(rows, cols, numMtnTiles) {
  const maxMtnTiles = rows * cols - 1;
  const effectiveMtnTiles = Math.min(numMtnTiles, maxMtnTiles);
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  let placedTiles = 0;

  while (placedTiles < effectiveMtnTiles) {
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

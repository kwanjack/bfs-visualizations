import React, { useState, useEffect } from 'react';
import "../app/globals.css"; // Ensure TailwindCSS is imported
import { useSpring, useSprings, animated } from '@react-spring/web'

export default function FloodFill() {
  const [algorithm, setAlgorithm] = useState('BFS');
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [numMtnTiles, setNumMtnTiles] = useState(5);
  const [sr, setStartRow] = useState(0);
  const [sc, setStartCol] = useState(0);
  const [cr, setCurrentRow] = useState(0);
  const [cc, setCurrentCol] = useState(0);
  const [selectedTile, setSelectedTile] = useState({ row: null, col: null });
  const [image, setImage] = useState([]);
  const [floodFillState, setFloodFillState] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderStructure, setOrderStructure] = useState([]);

  useEffect(() => {
    setImage(generateRandomGrid(rows, cols, numMtnTiles));
  }, [rows, cols, numMtnTiles]);

  const handleInitialize = () => {
    if (sr >= 0 && sr < rows && sc >= 0 && sc < cols) {
      const initialState = initializeFloodFill(image, sr, sc, [0, 1]);
      if (initialState) {
        setCurrentRow(sr);
        setCurrentCol(sc);
        setFloodFillState(initialState);
        setIsInitialized(true);
        const newOrderStructure = algorithm === 'BFS' ? [...initialState.queue] : [...initialState.stack];
        setOrderStructure(newOrderStructure);
        
        // Set the next tile to be processed
        if (newOrderStructure.length > 0) {
          const [nextRow, nextCol] = algorithm === 'BFS' ? newOrderStructure[0] : newOrderStructure[newOrderStructure.length - 1];
          setCurrentRow(nextRow);
          setCurrentCol(nextCol);
        }
      }
    } else {
      alert("Starting coordinates are out of bounds.");
    }
  };

  const getNextTile = () => {
    if (orderStructure.length === 0) return [-1, -1];
    if (algorithm === 'BFS') return orderStructure[0];
    else return orderStructure[orderStructure.length - 1];
  };

  const handleStep = () => {
    if (floodFillState) {

      // Update current tile before processing the step
      const [nextRow, nextCol] = getNextTile();
      setCurrentRow(nextRow);
      setCurrentCol(nextCol);

      const nextState = algorithm === 'BFS' 
        ? floodFillStepBFS(floodFillState)
        : floodFillStepDFS(floodFillState);
      if (nextState) {
        setFloodFillState(nextState);
        setImage([...nextState.image]);
        setOrderStructure(algorithm === 'BFS' ? [...nextState.queue] : [...nextState.stack]);
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
    setOrderStructure([]); // Clear the queue/stack
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
    if (sr >= newRows) setStartRow(newRows - 1);
  };

  const handleColsChange = (event) => {
    const newCols = parseInt(event.target.value);
    if(numMtnTiles >= newCols * rows) {
      const newMtnTiles = newCols * rows - 1;
      setNumMtnTiles(newMtnTiles);
    }
    setCols(newCols);
    resetTiles(rows, newCols, numMtnTiles);
    if (sc >= newCols) setStartCol(newCols - 1);
  };

  const handleMtnTilesChange = (event) => {
    const newMtnTiles = parseInt(event.target.value);
    setNumMtnTiles(newMtnTiles);
    resetTiles(rows, cols, newMtnTiles);
  };

  const handleTileClick = (rowIndex, colIndex) => {
    if (image[rowIndex][colIndex] === 0) {
      setStartRow(rowIndex);
      setStartCol(colIndex);
      setSelectedTile({ row: rowIndex, col: colIndex });
    }
  };

  const floodSprings = useSprings(
    image.flat().length, // Total number of divs
    image.flat().map((pixel, index) => ({
      from: { height: '0%' },
      to: { height: pixel === 1 ? '100%' : '0%' },
      config: { duration: 500 },
    }))
  );

  const AlgorithmSelector = () => {
    const [flipped, setFlipped] = useState(false);
  
    const { transform, opacity } = useSpring({
      opacity: flipped ? 1 : 0,
      transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
      config: { mass: 5, tension: 500, friction: 80 },
    });
  
    const handleClick = () => {
      setFlipped(!flipped);
      setAlgorithm(flipped ? 'BFS' : 'DFS');
      resetTiles(rows, cols, numMtnTiles);
    };
  
    return (
      <div onClick={handleClick} className="relative inline-block w-20 h-12 mb-2 cursor-pointer align-middle">
        <animated.div
          className="absolute w-full h-full flex items-center justify-center bg-blue-400 text-white rounded"
          style={{
            opacity: opacity.to(o => 1 - o),
            transform,
            rotateX: '0deg',
          }}
        >
          BFS
        </animated.div>
        <animated.div
          className="absolute w-full h-full flex items-center justify-center bg-purple-400 text-white rounded"
          style={{
            opacity,
            transform,
            rotateX: '180deg',
          }}
        >
          DFS
        </animated.div>
      </div>
    );
  };

  const queueStackDisplay = () => {
    const maxDisplay = Math.floor(Math.max(5, rows * cols / 6));
    const displayItems = algorithm === 'DFS' ? [...orderStructure].reverse() : orderStructure;
    
    const getItemStyle = (index) => {
      switch(index) {
        case 0: return 'text-2xl font-extrabold';
        default: return '';
      }
    };
  
    const renderItem = (tile, index) => (
      <li key={index} className={getItemStyle(index)}>
        ({tile[0]}, {tile[1]})
      </li>
    );
  
    return (
      <div>
        <div className="pb-6">
          <h2 className="text-3xl font-extrabold mb-2">Status:</h2>
          <p className="text-2xl">
            {!isInitialized ? 'Select A Tile To Begin.' : (
              isInitialized && !isComplete ? 'In Progress.' :
              'Complete.'
            )}
          </p>
        </div>
        <h2 className="text-3xl font-extrabold mb-2">
          Next In {algorithm === 'BFS' ? 'Queue:' : 'Stack:'}
        </h2>
        {orderStructure.length > 0 ? (
          <ul className='text-m'>
            {displayItems.slice(0, maxDisplay).map(renderItem)}
            {orderStructure.length > maxDisplay && <li>...</li>}
          </ul>
        ) : (
          <p className='text-2xl'>Empty.</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-4xl font-extrabold mb-4">
        Flood Fill 
        <span className="mx-2">{AlgorithmSelector()}</span>
        Visualizer
      </h1>

      <div className="w-full grid grid-cols-3 gap-4">
        {/* Grid configuration controls */}
        <div className="flex-col mr-8 inline-block items-left">
          {/* Rows control */}
          <div className="flex flex-col items-center pb-10">
            <label className="mb-1 text-xl font-extrabold">Rows: {rows}</label>
            <input
              type="range"
              min="3"
              max="10"
              value={rows}
              onChange={handleRowsChange}
              className="w-64 accent-purple-300"
            />
          </div>
          {/* Columns control */}
          <div className="flex flex-col items-center pb-10">
            <label className="mb-1 text-xl font-extrabold">Columns: {cols}</label>
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
            <label className="mb-1 text-xl font-extrabold">Mountain Tiles: {numMtnTiles}</label>
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
                      pixel >= 2 ? 'bg-gray-300' : 'bg-black'
                    } ${(!isInitialized && selectedTile.row === rowIndex && selectedTile.col === colIndex) || 
                          (isInitialized && rowIndex === cr && colIndex === cc) ? 'border-4 border-yellow-500' : ''}`}
                  >
                    <animated.div 
                      style={{ ...floodSprings[index] }}
                      className={`absolute bottom-0 left-0 w-full ${ algorithm === 'BFS' ? 'bg-blue-400' : 'bg-purple-400'}`}
                    />
                  </animated.div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-left ml-32">
          { queueStackDisplay() }
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
            className={`px-4 py-2 w-36 rounded 
                        ${floodFillState !== null || isInitialized || selectedTile.row === null || selectedTile.col === null ? 
                        'bg-gray-500 text-white cursor-not-allowed opacity-50' : 
                        'bg-transparent text-white border-2 border-yellow-700 hover:border-yellow-500'}`}
          >
            Start
          </button>
        )}
        {isInitialized && (
          <button
            onClick={handleStep}
            disabled={isComplete}
            className={`px-4 py-2 w-36 rounded 
                        ${isComplete || floodFillState === null ? 
                        'bg-gray-500 text-white cursor-not-allowed opacity-50' : 
                        'bg-transparent text-white border-2 border-blue-800 hover:border-blue-500'}`}
          >
            {algorithm === "BFS" ? 'Shift' : 'Pop'}
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
          grid[x][y] = 2;
          placedTiles++;
      }
  }

  return grid;
}

// Reuse the flood fill step-by-step functions
function initializeFloodFill(image, sr, sc, floodStates) {
  const [floodStart, floodEnd] = floodStates;
  
  if (floodStart === floodEnd) {
    return null;
  }

  const m = image.length;
  const n = image[0].length;

  const queue = [[sr, sc]];
  const stack = [[sr, sc]];

  return {
    image,
    queue,
    stack,
    directions: [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ],
    floodStates,
    m,
    n,
  };
}

function floodFillStepBFS(state) {
  const { image, queue, directions, floodStates, m, n } = state;
  const [floodStart, floodEnd] = floodStates;

  if (queue.length === 0) {
    return null;
  }

  const [x, y] = queue.shift();

  if (image[x][y] === floodStart) {
    image[x][y] = floodEnd;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < m && ny >= 0 && ny < n && image[nx][ny] === floodStart) {
        queue.push([nx, ny]);
      }
    }
  }

  return { ...state, image, queue };
}

function floodFillStepDFS(state) {
  const { image, stack, directions, floodStates, mtnStates, m, n } = state;
  const [floodStart, floodEnd] = floodStates;

  if (stack.length === 0) {
    return null;
  }

  const [x, y] = stack.pop(); // DFS uses pop to get the last element (LIFO)

  if (image[x][y] === floodStart) {
    image[x][y] = floodEnd;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < m && ny >= 0 && ny < n && image[nx][ny] === floodStart) {
        stack.push([nx, ny]); // Add neighbors to the stack
      }
    }
  }

  return { ...state, image, stack };
}

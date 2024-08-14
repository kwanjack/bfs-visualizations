import React, { useState } from 'react';



export default function SlidingPuzzle() {
    const [lastClicked, setLastClicked] = useState([-1,-1]);
    const [secondLastClicked, setSecondLastClicked] = useState([-1,-1]);
    const [board, setBoard] = useState([[1,2,3], [4,-1,5]]);

    const [exampleNumber, setExampleNumber] = useState(69);

    const renderCell = (row: any, col: any) => {
        if (board[row][col] == null) {
            return <div> ( ) </div>;
        }
        return <div>{board[row][col]}</div>;
    }

    const onCellClicked = (row: any, col: any) => {
        
        let lastClickedR = lastClicked[0];
        let lastClickedC = lastClicked[1];

        setLastClicked([row, col]);
        setSecondLastClicked([lastClickedR, lastClickedC])

        if (lastClickedR !== -1) { // cheesey way of saying "i've clcked 2 things before"
            swap([lastClickedR, lastClickedC], [row, col]);
        }
    }


    const swap = (firstPair: Array<number>, secondPair: Array<number>) => {
        let newResult = [[...board[0]],  [...board[1]]];

        newResult[firstPair[0]][firstPair[1]] = board[secondPair[0]][secondPair[1]];
        newResult[secondPair[0]][secondPair[1]] = board[firstPair[0]][firstPair[1]];

        setBoard(newResult);
    }


    return (
        <div className="grid grid-cols-3">
            {console.log("lastclicked: " + lastClicked)}   
            {console.log("secondlast: " + secondLastClicked)}    
 

            <div className="bg-slate-800" onClick={() => onCellClicked(0, 0)}>{ renderCell(0, 0) }</div>
            <div onClick={() => onCellClicked(0, 1)}>{ renderCell(0, 1) }</div>
            <div onClick={() => onCellClicked(0, 2)}>{ renderCell(0, 2) }</div>
            <div onClick={() => onCellClicked(1, 0)}>{ renderCell(1, 0) }</div>
            <div onClick={() => onCellClicked(1, 1)}>{ renderCell(1, 1) }</div>
            <div onClick={() => onCellClicked(1, 2)}>{ renderCell(1, 2) }</div>
            <div> My secret number is {exampleNumber} </div>
        </div>
    );
  }
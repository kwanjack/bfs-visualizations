
let boardState = [[1,2,3],[4, null, 5]];


export default function SlidingPuzzle() {

    const renderCell = (row: any, col: any) => {
        if (boardState[row][col] == null) {
            return <div> ( ) </div>;
        }
        return <div>{boardState[row][col]}</div>;
    }


    return (
        <div className="grid grid-cols-3">
            <div>{ renderCell(0, 0) }</div>
            <div>{ renderCell(0, 1) }</div>
            <div>{ renderCell(0, 2) }</div>
            <div>{ renderCell(1, 0) }</div>
            <div>{ renderCell(1, 1) }</div>
            <div>{ renderCell(1, 2) }</div>
        </div>
    );
  }
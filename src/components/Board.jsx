import Cell from "./Cell";

function Board({ grid, onCellClick, hideShips }) {
  return (
    <div className="board">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            hideShips={hideShips}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        )),
      )}
    </div>
  );
}

export default Board;

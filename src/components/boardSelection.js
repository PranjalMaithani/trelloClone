import { randomVividColor } from "../utils/lib.js";

export function BoardSelection({ boards, setBoards, setCurrentBoard }) {
  const Board = ({ board }) => {
    const color = randomVividColor(60, 70, 60, 70);
    return (
      <div
        className="boardTile cardText"
        style={{ backgroundColor: `hsl(${color.h},${color.s}%,${color.l}%)` }}
        onClick={() => {
          setCurrentBoard(board);
        }}
      >
        <span>{board.name}</span>
      </div>
    );
  };

  return (
    <div className="boardsSelectionWrapper">
      <h1>Select a board:</h1>
      <div className="boardsGrid">
        {boards.map((board) => {
          return <Board board={board} key={board.id} />;
        })}
      </div>
    </div>
  );
}

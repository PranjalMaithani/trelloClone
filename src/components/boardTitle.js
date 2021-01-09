import { updateBoard } from "../utils/updateData.js";
import { forwardRef, useRef, useState } from "react";
import { asyncCatch, useClickOutside, handleKeyDown } from "../utils/lib.js";

import {
  TrelloBoardContext,
  CurrentBoardContext,
} from "../resources/dataContext.js";
import { useContext } from "react";

export function BoardTitle() {
  const [renaming, setRenaming] = useState(false);
  const boardRenameRef = useRef(null);
  const { boards, setBoards } = useContext(TrelloBoardContext);
  const { currentBoard, setCurrentBoard } = useContext(CurrentBoardContext);

  const confirmBoardRename = () => {
    if (!boardRenameRef.current) return;

    const newValue = boardRenameRef.current.value;
    if (newValue === "") {
      setRenaming(false);
      return;
    }
    asyncCatch(updateBoard, currentBoard.id, newValue);
    const newBoardsArray = boards.map((board) => {
      if (board.id === currentBoard.id) {
        setCurrentBoard({ ...board, name: newValue });
        return { ...board, name: newValue };
      } else return board;
    });
    setBoards(newBoardsArray);
    setRenaming(false);
  };

  const RenameBoardInput = forwardRef((props, ref) => {
    const inputFieldRef = useRef();
    useClickOutside(inputFieldRef, confirmBoardRename);

    return (
      <div ref={inputFieldRef}>
        <input
          autoFocus
          ref={ref}
          defaultValue={currentBoard.name}
          onKeyDown={(event) => {
            handleKeyDown(event, confirmBoardRename, confirmBoardRename);
          }}
          className="boardTitle boardTitleEditor"
        />
      </div>
    );
  });

  return (
    <div>
      {!renaming ? (
        <span
          className="boardTitle boardTitleStatic"
          onClick={() => {
            setRenaming(true);
          }}
        >
          {currentBoard.name}
        </span>
      ) : (
        <RenameBoardInput ref={boardRenameRef} />
      )}
    </div>
  );
}

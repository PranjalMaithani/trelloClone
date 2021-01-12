import { randomVividColor } from "../utils/lib.js";
import { deleteBoard } from "../utils/updateData.js";
import { addBoard } from "../utils/createData.js";
import { useRef, useState, useEffect, useContext } from "react";
import { handleKeyDown } from "../utils/lib.js";
import { Loader } from "./loader/loader.js";
import {
  TrelloBoardContext,
  CurrentBoardContext,
} from "../resources/dataContext.js";

export function BoardSelection({
  setCurrentBoard,
  hasFetchedBoards,
  isLoggedIn,
}) {
  const [isCreatingNewBoard, setCreatingNewBoard] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentBoardSelected = useRef(null);

  const { boards, setBoards } = useContext(TrelloBoardContext);
  const { currentBoard } = useContext(CurrentBoardContext);

  useEffect(() => {
    const cancelAllActions = (event) => {
      if (event.key === "Escape") {
        setIsDeleting(false);
        setCreatingNewBoard(false);
      }
    };
    document.addEventListener("keydown", cancelAllActions);
    return () => {
      document.removeEventListener("keydown", cancelAllActions);
    };
  }, [isDeleting, isCreatingNewBoard]);

  const DeleteButton = ({ board }) => {
    return (
      <button
        className="cardButton listButton deleteButton"
        onClick={(event) => {
          event.stopPropagation();
          currentBoardSelected.current = board;
          setIsDeleting(true);
        }}
      >
        X
      </button>
    );
  };

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
        <div className="cardButtonsWrapper">
          <DeleteButton board={board} />
        </div>
        <span className="boardTileText">{board.name}</span>
      </div>
    );
  };

  const createNewBoard = async (event) => {
    event.preventDefault();
    const boardName = event.currentTarget.input.value;
    const newBoard = await addBoard(boardName);
    setBoards((prevState) => [...prevState, newBoard]);
    setCurrentBoard(newBoard);
    setCreatingNewBoard(false);
  };

  const cancelNewBoard = () => {
    setCreatingNewBoard(false);
    setIsDeleting(false);
  };

  function NewBoardMenu() {
    return (
      <div className="messageWindow">
        <form
          onSubmit={createNewBoard}
          onKeyDown={(event) => {
            handleKeyDown(event, createNewBoard, cancelNewBoard);
          }}
        >
          <span>Creating a new board</span>
          <input
            autoComplete="off"
            name="input"
            autoFocus
            className="cardText modalInnerCardEditor boardTitle boardTitleEditor"
          />
          <div className="messageWindowButtonsWrapper">
            <button className="confirmButton" type="submit">
              Confirm
            </button>
            <button className="cancelButton" onClick={cancelNewBoard}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  const deleteConfirm = (boardId) => {
    deleteBoard(boardId);
    const boardsArr = [...boards];
    const filteredBoards = boardsArr.filter((board) => board.id !== boardId);
    setBoards(filteredBoards);
    setIsDeleting(false);
  };

  function DeleteConfirmation({ board }) {
    return (
      <div className="messageWindow">
        <span>Are you sure you want to delete {board.name}?</span>
        <span>All data of this board will be removed</span>
        <div className="messageWindowButtonsWrapper">
          <button
            className="confirmButton"
            onClick={() => {
              deleteConfirm(board.id);
            }}
          >
            Confirm
          </button>
          <button className="cancelButton" onClick={cancelNewBoard} autoFocus>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  //FINAL RENDERING:

  //if user has selected a board or is logged out
  if (currentBoard !== null || isLoggedIn === false) return null;

  //if we are fetching boards and the user is logged in, show a loader
  if (!hasFetchedBoards)
    return (
      <div className="boardsSelectionWrapper">
        <Loader />
      </div>
    );

  return (
    <div className="boardsSelectionWrapper">
      {isDeleting ? (
        <DeleteConfirmation board={currentBoardSelected.current} />
      ) : (
        <div>
          {!isCreatingNewBoard ? (
            <div>
              <h1>Select a board:</h1>
              <div className="boardsGrid">
                {boards.map((board) => {
                  return <Board board={board} key={board.id} />;
                })}
                <div
                  className="boardTile addBoardButton"
                  onClick={() => {
                    setCreatingNewBoard(true);
                  }}
                >
                  <span>+ Create new board</span>
                </div>
              </div>
            </div>
          ) : (
            <NewBoardMenu />
          )}
        </div>
      )}
    </div>
  );
}

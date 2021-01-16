import { randomVividColor } from "../utils/lib.js";
import { deleteBoard } from "../utils/updateData.js";
import { addBoard } from "../utils/createData.js";
import { useRef, useState, useEffect, useContext, useCallback } from "react";
import { handleKeyDown, convertToSlug } from "../utils/lib.js";
import { Loader } from "./loader/loader.js";
import {
  TrelloBoardsContext,
  CurrentBoardContext,
  HasDataFetchedContext,
} from "../resources/dataContext.js";
import { Link, useHistory } from "react-router-dom";

export function BoardSelection({ moveToBoard, hasFetchedBoards, isLoading }) {
  const [isCreatingNewBoard, setIsCreatingNewBoard] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentBoardSelected = useRef(null);

  const { setHasDataFetched } = useContext(HasDataFetchedContext);

  const { boards, setBoards } = useContext(TrelloBoardsContext);
  const { setCurrentBoard } = useContext(CurrentBoardContext);

  const history = useHistory();

  //resetting everything on component load
  useEffect(() => {
    setCurrentBoard(null);
    setIsCreatingNewBoard(false);
    setIsDeleting(false);
    setHasDataFetched(false);
    isLoading.current = false;
  }, [setCurrentBoard, setHasDataFetched, isLoading]);

  useEffect(() => {
    const cancelAllActions = (event) => {
      if (event.key === "Escape") {
        setIsDeleting(false);
        setIsCreatingNewBoard(false);
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
          event.preventDefault();
          event.stopPropagation();
          currentBoardSelected.current = board;
          setIsDeleting(true);
        }}
      >
        X
      </button>
    );
  };

  const Board = useCallback(
    ({ board }) => {
      const color = randomVividColor(60, 70, 60, 70);
      const slugBoardName = convertToSlug(board.name);
      return (
        <Link
          to={`/b/${board.shortLink}/${slugBoardName}`}
          className="boardTile cardText"
          style={{ backgroundColor: `hsl(${color.h},${color.s}%,${color.l}%)` }}
          onClick={() => {
            moveToBoard(board);
          }}
        >
          <div className="cardButtonsWrapper">
            <DeleteButton board={board} />
          </div>
          <span className="boardTileText">{board.name}</span>
        </Link>
      );
    },
    [moveToBoard]
  );

  const createNewBoard = async (event) => {
    event.preventDefault();
    const boardName = event.currentTarget.input.value;
    const newBoard = await addBoard(boardName);
    setBoards((prevState) => [...prevState, newBoard]);
    setIsCreatingNewBoard(false);
    moveToBoard(newBoard);
    history.push(newBoard.url.slice(18), null); //removing https://trello.com from the url part
  };

  const cancelNewBoard = () => {
    setIsCreatingNewBoard(false);
    setIsDeleting(false);
  };

  const NewBoardButton = ({ numberOfBoards }) => {
    if (numberOfBoards === 10) {
      return (
        <div className="cardText boardTile addBoardButton">
          Maximum board limit reached
        </div>
      );
    } else {
      return (
        <div
          className="cardText boardTile addBoardButton"
          onClick={() => {
            setIsCreatingNewBoard(true);
          }}
        >
          + Create new board
        </div>
      );
    }
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
            className="boardTitle boardTitleEditor messageWindowInput"
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

  //if we are fetching boards and the user is logged in, show a loader
  if (!hasFetchedBoards)
    return (
      <div className="boardsSelectionWrapper">
        <Loader />
      </div>
    );

  //otherwise show the board selection screen

  return (
    <div className="boardsSelectionWrapper">
      {isDeleting && (
        <DeleteConfirmation board={currentBoardSelected.current} />
      )}
      {isCreatingNewBoard && <NewBoardMenu />}

      {!isDeleting && !isCreatingNewBoard && (
        <div>
          <h1>Select a board:</h1>
          <div className="boardsGrid">
            {boards.map((board) => (
              <Board board={board} key={board.id} />
            ))}

            <NewBoardButton numberOfBoards={boards.length} />
          </div>
        </div>
      )}
    </div>
  );
}

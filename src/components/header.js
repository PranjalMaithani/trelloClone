import { BoardTitle } from "./boardTitle.js";
import { useContext } from "react";

import {
  CurrentBoardContext,
  TrelloBoardsContext,
} from "../resources/dataContext.js";
import { Link, useRouteMatch } from "react-router-dom";

export const Header = () => {
  const { currentBoard, setCurrentBoard } = useContext(CurrentBoardContext);
  const { boards } = useContext(TrelloBoardsContext);
  const match = useRouteMatch("/:b");

  return (
    <header className="App-header">
      <div className="headerTab">
        {currentBoard !== null && match && match.params.b !== "boards" && (
          <div className="boardUIbuttons">
            <Link
              to="/boards"
              className="backButton"
              onClick={(event) => {
                if (match.params.b !== "b" && boards.length > 0) {
                  event.preventDefault();
                  return;
                }
                setCurrentBoard(null);
              }}
            >
              ⬅
            </Link>

            <BoardTitle />
          </div>
        )}
      </div>
      <h1>TRULLO</h1>
      <div className="headerTab" style={{ justifyContent: "flex-end" }}>
        <span className="headerAuthorName">Pranjal Maithani</span>
      </div>
    </header>
  );
};

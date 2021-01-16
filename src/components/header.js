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
  let titleVisible, leftHeaderTabFlex;
  titleVisible =
    window.innerWidth > 900 || match.params.b === "boards" ? "visible" : "none";
  leftHeaderTabFlex =
    window.innerWidth < 900 && match.params.b === "boards" ? "0%" : "100%";

  return (
    <header className="App-header">
      <div className="headerTab" style={{ flexBasis: leftHeaderTabFlex }}>
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
      <h1 className="trulloLogo" style={{ display: titleVisible }}>
        TRULLO
      </h1>
      <div
        className="headerTab headerTabRight"
        style={{ justifyContent: "flex-end" }}
      >
        <span className="headerAuthorName">Pranjal Maithani</span>
      </div>
    </header>
  );
};

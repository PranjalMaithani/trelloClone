import { BoardTitle } from "./boardTitle.js";
import { useContext, useState, useEffect } from "react";

import {
  CurrentBoardContext,
  TrelloBoardsContext,
} from "../resources/dataContext.js";
import { Link, useRouteMatch } from "react-router-dom";
import { useResize } from "../utils/lib.js";

export const Header = () => {
  const { currentBoard, setCurrentBoard } = useContext(CurrentBoardContext);
  const { boards } = useContext(TrelloBoardsContext);
  const match = useRouteMatch("/:b");
  const [titleVisible, setTitleVisible] = useState(true);
  const [headerFlex, setHeaderFlex] = useState("center");

  let windowWidth = useResize(1000);

  useEffect(() => {
    setHeaderFlex(
      (match && match.params.b) === "boards" ? "center" : "space-between"
    );
    setTitleVisible(
      windowWidth > 600 || (match && match.params.b) === "boards"
        ? "visible"
        : "hidden"
    );
  }, [windowWidth, match]);

  return (
    <header className="App-header" style={{ justifyContent: headerFlex }}>
      <div className="headerTab headerTabLeft">
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
      <h1 className="trulloLogo" style={{ visibility: titleVisible }}>
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

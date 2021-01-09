import { BoardTitle } from "./boardTitle.js";
import { useContext } from "react";

import {
  CurrentBoardContext,
  HasDataFetchedContext,
} from "../resources/dataContext.js";

export const Header = () => {
  const { setHasDataFetched } = useContext(HasDataFetchedContext);
  const { currentBoard, setCurrentBoard } = useContext(CurrentBoardContext);

  return (
    <header className="App-header">
      <div className="headerTab">
        {currentBoard !== null ? (
          <div className="boardUIbuttons">
            <button
              onClick={() => {
                setCurrentBoard(null);
                setHasDataFetched(false);
              }}
              className="backButton"
            >
              ⬅
            </button>
            <BoardTitle />
          </div>
        ) : null}
      </div>
      <h1>TRULLO</h1>
      <div className="headerTab" style={{ justifyContent: "flex-end" }}>
        <span className="headerAuthorName">Pranjal Maithani</span>
      </div>
    </header>
  );
};

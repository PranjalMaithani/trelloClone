import React from "react";
import "./App.css";

import {
  fetchBoards,
  fetchBoardLists,
  fetchBoardCards,
} from "./utils/fetchData.js";

import {
  TrelloBoardContext,
  TrelloCardsContext,
  TrelloListsContext,
  HasDataFetchedContext,
  CurrentBoardContext,
} from "./resources/dataContext";

import { LoginScreen } from "./components/LoginScreen";
import { BoardSelection } from "./components/boardSelection.js";
import { Board } from "./components/board.js";
import { Header } from "./components/header.js";
import { filterCardsArray } from "./utils/cardsSort.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [boards, setBoards] = React.useState([]);
  const [lists, setLists] = React.useState([]);
  const [cards, setCards] = React.useState([]); //will have sub arrays per list [["peel", "chop", "cook", "eat"], ["brainstorm", "sketch", "draw"]]
  const [hasDataFetched, setHasDataFetched] = React.useState(false);
  const [hasFetchedBoards, setHasFetchedBoards] = React.useState(false);

  const [currentBoard, setCurrentBoard] = React.useState(null);
  const lastActiveBoard = React.useRef(null);

  const boardsValue = React.useMemo(() => ({ boards, setBoards }), [boards]);
  const listsValue = React.useMemo(() => ({ lists, setLists }), [lists]);
  const cardsValue = React.useMemo(() => ({ cards, setCards }), [cards]);
  const currentBoardValue = React.useMemo(
    () => ({ currentBoard, setCurrentBoard }),
    [currentBoard]
  );
  const hasDataFetchedValue = React.useMemo(
    () => ({ hasDataFetched, setHasDataFetched }),
    [hasDataFetched]
  );

  React.useEffect(() => {
    const assign = async () => {
      const boardsArr = await fetchBoards();
      setBoards(boardsArr);
      setHasFetchedBoards(true);
    };
    if (isLoggedIn) {
      assign();
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    const assign = async () => {
      const listsArr = await fetchBoardLists(currentBoard.id);
      const cardsArr = await fetchBoardCards(currentBoard.id);
      const filteredCardsArr = filterCardsArray(listsArr, cardsArr);

      setLists(listsArr);
      setCards(filteredCardsArr);
      setHasDataFetched(true);
    };

    if (currentBoard !== null) assign();
  }, [currentBoard]);

  return (
    <div className="App">
      <TrelloBoardContext.Provider value={boardsValue}>
        <CurrentBoardContext.Provider value={currentBoardValue}>
          <Header />
          <LoginScreen isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <BoardSelection
            isLoggedIn={isLoggedIn}
            hasFetchedBoards={hasFetchedBoards}
            setCurrentBoard={(board) => {
              if (board !== lastActiveBoard.current) {
                setLists([]);
                setCards([]);
                setHasDataFetched(false);
              } else {
                setHasDataFetched(true);
              }
              setCurrentBoard(board);
              lastActiveBoard.current = board;
            }}
          />
          <TrelloListsContext.Provider value={listsValue}>
            <TrelloCardsContext.Provider value={cardsValue}>
              <HasDataFetchedContext.Provider value={hasDataFetchedValue}>
                <Board />
              </HasDataFetchedContext.Provider>
            </TrelloCardsContext.Provider>
          </TrelloListsContext.Provider>
        </CurrentBoardContext.Provider>
      </TrelloBoardContext.Provider>
    </div>
  );
}

export default App;

import React, { useCallback } from "react";
import "./App.css";

import {
  fetchBoards,
  fetchBoardLists,
  fetchBoardCards,
} from "./utils/fetchData.js";

import {
  TrelloBoardsContext,
  TrelloCardsContext,
  TrelloListsContext,
  HasDataFetchedContext,
  CurrentBoardContext,
} from "./resources/dataContext";

import {
  getTokenFromStorage,
  setToken,
  setTokenToNull,
} from "./resources/token";

// import { getError, resetError } from "./resources/errorRecorder";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ErrorWindow } from "./components/ErrorWindow";
import { LoginScreen } from "./components/LoginScreen";
import { BoardSelection } from "./components/boardSelection.js";
import { Board } from "./components/board.js";
import { Header } from "./components/header.js";
import { Footer } from "./components/footer.js";
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
    const tokenStorage = getTokenFromStorage();
    if (tokenStorage !== "") {
      setToken(tokenStorage);
      setIsLoggedIn(true);
    }
  }, []);

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

  const moveToBoard = useCallback((board) => {
    if (board !== lastActiveBoard.current) {
      setLists([]);
      setCards([]);
      setHasDataFetched(false);
    } else {
      setHasDataFetched(true);
    }
    setCurrentBoard(board);
    lastActiveBoard.current = board;
  }, []);

  return (
    <Router>
      <div className="App">
        <TrelloBoardsContext.Provider value={boardsValue}>
          <CurrentBoardContext.Provider value={currentBoardValue}>
            <Header />
            <Switch>
              {/* {getError().message !== null && (
                <Route path="/:error">
                  <ErrorWindow message={getError().message} />
                </Route>
              )} */}
              <Route exact path="/">
                <LoginScreen
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              </Route>
              {!isLoggedIn && (
                <Route path="/">
                  <ErrorWindow message="You need to be logged in to access that" />
                </Route>
              )}
              <Route exact path="/boards">
                <BoardSelection
                  hasFetchedBoards={hasFetchedBoards}
                  moveToBoard={moveToBoard}
                />
              </Route>

              <Route path="/:b/:shortLink/:name?">
                <TrelloListsContext.Provider value={listsValue}>
                  <TrelloCardsContext.Provider value={cardsValue}>
                    <HasDataFetchedContext.Provider value={hasDataFetchedValue}>
                      <Board />
                    </HasDataFetchedContext.Provider>
                  </TrelloCardsContext.Provider>
                </TrelloListsContext.Provider>
              </Route>
            </Switch>
          </CurrentBoardContext.Provider>
        </TrelloBoardsContext.Provider>
        <Footer
          isLoggedIn={isLoggedIn}
          logOutResetData={() => {
            setIsLoggedIn(false);
            setCurrentBoard(null);
            setHasDataFetched(false);
            setHasFetchedBoards(false);
            setBoards([]);
            setLists([]);
            setCards([]);
            lastActiveBoard.current = null;
            setTokenToNull();
          }}
        />
      </div>
    </Router>
  );
}

export default App;

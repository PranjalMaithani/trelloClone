import React from "react";
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
  let isLoading = React.useRef(false);

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
      setHasDataFetched(false);
      isLoading.current = false;
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
      if (isLoading.current) return;
      isLoading.current = true;
      const listsArr = await fetchBoardLists(currentBoard.id);
      const cardsArr = await fetchBoardCards(currentBoard.id);
      const filteredCardsArr = filterCardsArray(listsArr, cardsArr);
      setLists(listsArr);
      setCards(filteredCardsArr);
      setHasDataFetched(true);
    };

    if (currentBoard !== null && !isLoading.current) assign();
  }, [currentBoard, isLoading]);

  React.useEffect(() => {
    if (hasDataFetched) {
      isLoading.current = false;
    }
  }, [hasDataFetched]);

  const moveToBoard = React.useCallback((board) => {
    setCurrentBoard(board);
    if (
      lastActiveBoard.current === null ||
      board.id !== lastActiveBoard.current.id
    ) {
      setLists([]);
      setCards([]);
      setHasDataFetched(false);
      isLoading.current = false;
    } else {
      setHasDataFetched(true);
    }

    lastActiveBoard.current = board;
  }, []);

  React.useEffect(() => {
    if (currentBoard && currentBoard !== lastActiveBoard.current) {
      moveToBoard(currentBoard);
    }
  }, [currentBoard, moveToBoard]);

  return (
    <Router>
      <div className="App">
        <TrelloBoardsContext.Provider value={boardsValue}>
          <CurrentBoardContext.Provider value={currentBoardValue}>
            <Header hasFetchedBoards={hasFetchedBoards} />
            <Switch>
              <Route exact path="/">
                <LoginScreen
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              </Route>
              {!isLoggedIn && (
                <Route path="/">
                  <ErrorWindow message="You need to be logged in." />
                </Route>
              )}
              <Route exact path="/boards">
                <BoardSelection
                  hasFetchedBoards={hasFetchedBoards}
                  moveToBoard={moveToBoard}
                  isLoading={isLoading}
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

              <Route>
                <ErrorWindow message="Page not found" />
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

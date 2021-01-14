import { createContext } from "react";

export const TrelloBoardsContext = createContext({
  boards: [],
  setBoards: () => {},
});

export const TrelloListsContext = createContext({
  lists: [],
  setLists: () => {},
});

export const TrelloCardsContext = createContext({
  cards: [],
  setCards: () => {},
});

export const CurrentBoardContext = createContext({
  currentBoard: null,
  setCurrentBoard: () => {},
});

export const HasDataFetchedContext = createContext({
  hasDataFetched: null,
  setHasDataFetched: () => {},
});

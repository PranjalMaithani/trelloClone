import React from "react";
import "./App.css";

import {
  fetchBoards,
  fetchBoardLists,
  fetchBoardCards,
} from "./utils/fetchData.js";

import { Loader } from "./components/loader/loader.js";
import { BoardSelection } from "./components/boardSelection.js";
import { BoardTitle } from "./components/boardTitle.js";
import { List, AddListField } from "./components/list.js";
import { Card } from "./components/card.js";
import { filterCardsArray } from "./utils/cardsSort.js";
import {
  DragMaster,
  DroppableBoard,
  DraggableDroppableList,
  DraggableCard,
} from "./components/dragAndDropComponents.js";

function App() {
  const [boards, setBoards] = React.useState([]);
  const [lists, setLists] = React.useState([]);
  const [cards, setCards] = React.useState([]); //will have sub arrays per list [["peel", "chop", "cook", "eat"], ["brainstorm", "sketch", "draw"]]
  const [hasDataFetched, setHasDataFetched] = React.useState(false);
  const [hasFetchedBoards, setHasFetchedBoards] = React.useState(false);

  const [currentBoard, setCurrentBoard] = React.useState(null);
  const lastActiveBoard = React.useRef(null);

  React.useEffect(() => {
    const assign = async () => {
      const boardsArr = await fetchBoards();
      setBoards(boardsArr);
      setHasFetchedBoards(true);
    };

    assign();
  }, []);

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

  const Board = React.useCallback(
    ({ lists, cards, hasDataFetched, currentBoard }) => {
      return (
        <div className="board">
          {!hasDataFetched && <Loader />}
          <DragMaster
            cards={cards}
            setCards={setCards}
            lists={lists}
            setLists={setLists}
          >
            <DroppableBoard>
              {lists.map((list, listIndex) => (
                <DraggableDroppableList
                  key={list.id}
                  list={list}
                  listIndex={listIndex}
                >
                  <List
                    name={list.name}
                    id={list.id}
                    index={listIndex}
                    lists={lists}
                    setLists={setLists}
                    cards={cards}
                    setCards={setCards}
                  >
                    <ul>
                      {cards[listIndex] &&
                        cards[listIndex].map((card, cardIndex) => (
                          <DraggableCard
                            key={card.id}
                            card={card}
                            cardIndex={cardIndex}
                          >
                            <Card
                              card={card}
                              listIndex={listIndex}
                              cards={cards}
                              setCards={setCards}
                            />
                          </DraggableCard>
                        ))}
                    </ul>
                  </List>
                </DraggableDroppableList>
              ))}
              {hasDataFetched && (
                <AddListField
                  boardId={currentBoard.id}
                  setLists={setLists}
                  setCards={setCards}
                />
              )}
            </DroppableBoard>
          </DragMaster>
        </div>
      );
    },
    []
  );

  return (
    <div className="App">
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
              <BoardTitle
                currentBoard={currentBoard}
                setCurrentBoard={setCurrentBoard}
                boards={boards}
                setBoards={setBoards}
              />
            </div>
          ) : null}
        </div>
        <h1>TRULLO</h1>
        <div className="headerTab" style={{ justifyContent: "flex-end" }}>
          <span className="headerAuthorName">Pranjal Maithani</span>
        </div>
      </header>
      {currentBoard === null ? (
        <BoardSelection
          boards={boards}
          setBoards={setBoards}
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
      ) : (
        <Board
          cards={cards}
          lists={lists}
          hasDataFetched={hasDataFetched}
          currentBoard={currentBoard}
        />
      )}
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";

import {
  fetchBoards,
  fetchBoardLists,
  fetchBoardCards,
} from "./utils/fetchData.js";

import { BoardSelection } from "./components/boardSelection.js";
import { List, AddListField } from "./components/list.js";
import { Card } from "./components/card.js";
import { filterCardsArray } from "./utils/cardsSort.js";
import {
  DragMaster,
  DroppableBoard,
  DraggableDroppableList,
  DraggableCard,
} from "./components/dragAndDropComponents.js";
import { CardEditor } from "./utils/cardEditor";

function App() {
  const [boards, setBoards] = React.useState([]);
  const [lists, setLists] = React.useState([]);
  const [cards, setCards] = React.useState([]); //will have sub arrays per list [["peel", "chop", "cook", "eat"], ["brainstorm", "sketch", "draw"]]
  const [isEditingCard, setIsEditingCard] = React.useState(false);

  const [currentBoard, setCurrentBoard] = React.useState(null);

  let currentCard = React.useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    name: "",
    id: "",
  });

  React.useEffect(() => {
    const assign = async () => {
      const boardsArr = await fetchBoards();

      setBoards(boardsArr);
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
    };

    if (currentBoard !== null) assign();
  }, [currentBoard]);

  function Board() {
    return (
      <div className="board">
        {isEditingCard && (
          <CardEditor
            currentCard={currentCard.current}
            disableEditing={() => {
              setIsEditingCard(false);
            }}
            cards={cards}
            setCards={setCards}
          />
        )}
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
                            getCurrentCardValues={(values) => {
                              currentCard.current = values;
                              setIsEditingCard(true);
                            }}
                          />
                        </DraggableCard>
                      ))}
                  </ul>
                </List>
              </DraggableDroppableList>
            ))}
            {boards[0] && (
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
  }

  return (
    <div className="App">
      <header className="App-header">
        {currentBoard !== null ? (
          <h2 className="boardTitle">{currentBoard.name}</h2>
        ) : null}
        <h1>TRULLO</h1>
      </header>
      {currentBoard === null ? (
        <BoardSelection
          boards={boards}
          setBoards={setBoards}
          setCurrentBoard={(board) => {
            setCurrentBoard(board);
          }}
        />
      ) : (
        <Board />
      )}
    </div>
  );
}

export default App;

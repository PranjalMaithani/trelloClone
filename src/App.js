import React from "react";
import "./App.css";

import {
  fetchBoards,
  fetchBoardLists,
  fetchBoardCards,
} from "./utils/fetchData.js";

import { List } from "./components/list.js";
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

  React.useEffect(() => {
    const assign = async () => {
      const boardsArr = await fetchBoards();
      const listsArr = await fetchBoardLists(boardsArr[1].id);
      const cardsArr = await fetchBoardCards(boardsArr[1].id);
      const filteredCardsArr = filterCardsArray(listsArr, cardsArr);

      setBoards(boardsArr);
      setLists(listsArr);
      setCards(filteredCardsArr);
    };

    assign();
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div>
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
          </DroppableBoard>
        </DragMaster>
      </div>
    </div>
  );
}

export default App;

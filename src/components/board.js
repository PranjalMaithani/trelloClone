import { Loader } from "./loader/loader";

import {
  DragMaster,
  DroppableBoard,
  DraggableDroppableList,
  DraggableCard,
} from "./dragAndDropComponents";

import { List, AddListField } from "./list.js";
import { Card } from "./card.js";

import {
  TrelloListsContext,
  TrelloCardsContext,
  HasDataFetchedContext,
  CurrentBoardContext,
} from "../resources/dataContext.js";
import { useContext } from "react";

export const Board = () => {
  const { currentBoard } = useContext(CurrentBoardContext);
  const { lists } = useContext(TrelloListsContext);
  const { cards } = useContext(TrelloCardsContext);
  const { hasDataFetched } = useContext(HasDataFetchedContext);

  if (currentBoard === null) {
    return null;
  }

  return (
    <div className="board">
      {!hasDataFetched && <Loader />}
      <DragMaster>
        <DroppableBoard>
          {lists.map((list, listIndex) => (
            <DraggableDroppableList
              key={list.id}
              list={list}
              listIndex={listIndex}
            >
              <List name={list.name} id={list.id} index={listIndex}>
                <ul>
                  {cards[listIndex] &&
                    cards[listIndex].map((card, cardIndex) => (
                      <DraggableCard
                        key={card.id}
                        card={card}
                        cardIndex={cardIndex}
                      >
                        <Card card={card} listIndex={listIndex} />
                      </DraggableCard>
                    ))}
                </ul>
              </List>
            </DraggableDroppableList>
          ))}
          {hasDataFetched && <AddListField boardId={currentBoard.id} />}
        </DroppableBoard>
      </DragMaster>
    </div>
  );
};

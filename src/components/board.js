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
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useRouteMatch,
//   useParams,
//   Redirect,
// } from "react-router-dom";

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
          {(providedBoardDroppable, snapshotBoardDroppable) => (
            <div
              ref={providedBoardDroppable.innerRef}
              {...providedBoardDroppable.droppableProps}
              className="listsContainer"
            >
              {lists.map((list, listIndex) => (
                <DraggableDroppableList
                  key={list.id}
                  list={list}
                  listIndex={listIndex}
                >
                  {(providedListDroppable, snapshotListDroppable) => (
                    <div
                      ref={providedListDroppable.innerRef}
                      {...providedListDroppable.droppableProps}
                    >
                      <List
                        name={list.name}
                        id={list.id}
                        index={listIndex}
                        placeholder={providedListDroppable.placeholder}
                      >
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
                      </List>
                    </div>
                  )}
                </DraggableDroppableList>
              ))}
              {providedBoardDroppable.placeholder}
              {hasDataFetched && <AddListField boardId={currentBoard.id} />}
            </div>
          )}
        </DroppableBoard>
      </DragMaster>
    </div>
  );
};

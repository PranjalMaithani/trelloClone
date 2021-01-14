import { Loader } from "./loader/loader";
import { useEffect } from "react";
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
  TrelloBoardsContext,
} from "../resources/dataContext.js";

import { fetchCard, fetchBoard } from "../utils/fetchData";

// import { setError } from "../resources/errorRecorder";

import { useContext } from "react";
import { useRouteMatch } from "react-router-dom";

export const Board = () => {
  const { currentBoard, setCurrentBoard } = useContext(CurrentBoardContext);
  const { boards } = useContext(TrelloBoardsContext);
  const { lists } = useContext(TrelloListsContext);
  const { cards } = useContext(TrelloCardsContext);
  const { hasDataFetched } = useContext(HasDataFetchedContext);

  let match = useRouteMatch("/:b/:shortLink");

  useEffect(() => {
    let getBoard = getElementFromKey(
      boards,
      match.params.shortLink,
      "shortLink"
    );

    const getCardFromDB = async (cardId) => {
      const getCard = await fetchCard(cardId);
      //it's not a card url either, the user entered a wrong url
      if (getCard === undefined) {
        setCurrentBoard(null);
      } else {
        //getting the board for the card
        //if we have the boards already:
        if (boards.length > 0) {
          getBoard = getElementFromKey(boards, getCard.idBoard, "id");
          //otherwise fetch the board for the card as well
        } else {
          getBoard = await fetchBoard(getCard.idBoard);
        }
        setCurrentBoard(getBoard);
      }
    };

    //it might be a card URL, if it's not a board
    if (getBoard === undefined) {
      getCardFromDB(match.params.shortLink);
    } else {
      setCurrentBoard(getBoard);
    }
  }, [boards, cards, setCurrentBoard, match]);

  // //if the board doesn't exist
  // if (
  //   boards.length > 0 &&
  //   !getElementFromKey(boards, match.params.shortLink, "shortLink") &&
  //   !findCardFromId(cards, match.params.shortLink, "shortLink")
  // ) {
  //   setError({ message: "Board doesn't exist.", data: {} });
  //   return <Redirect to="/" />;
  // }

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

export const getElementFromKey = (array, id, key) => {
  return array.find((board) => board[key] === id);
};

//since cardsArray has subArrays, we need to go through each of those subArrays until we find the card
// const findCardFromId = (cardsArray, id, key) => {
//   for (let i = 0; i < cardsArray.length; ++i) {
//     const card = getElementFromKey(cardsArray[i], id, key);
//     if (card !== undefined) return card;
//   }
//   //if the card doesn't exist
//   return null;
// };

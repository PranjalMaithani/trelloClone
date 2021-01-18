import { Loader } from "./loader/loader";
import {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
  forwardRef,
} from "react";
import {
  DragMaster,
  DroppableBoard,
  DraggableDroppableList,
  DraggableCard,
} from "./dragAndDropComponents";

import { List, AddListField } from "./list.js";
import { Card } from "./card.js";
import { ErrorWindow } from "./ErrorWindow";

import {
  TrelloListsContext,
  TrelloCardsContext,
  HasDataFetchedContext,
  CurrentBoardContext,
  TrelloBoardsContext,
} from "../resources/dataContext.js";

import { fetchCard, fetchBoard } from "../utils/fetchData";
import { convertToSlug } from "../utils/lib";

import { useRouteMatch, useHistory } from "react-router-dom";

export const Board = forwardRef((props, boardRef) => {
  const { currentBoard, setCurrentBoard } = useContext(CurrentBoardContext);
  const { boards } = useContext(TrelloBoardsContext);
  const { lists } = useContext(TrelloListsContext);
  const { cards } = useContext(TrelloCardsContext);

  const { hasDataFetched } = useContext(HasDataFetchedContext);
  const [error, setError] = useState(null);
  let isLoading = useRef(false);

  let match = useRouteMatch("/:b/:shortLink");
  let history = useHistory();

  const resetData = useCallback(() => {
    setError(null);
    isLoading.current = false;
  }, []);

  useEffect(() => {
    if (hasDataFetched) isLoading.current = false;
  }, [hasDataFetched]);

  useEffect(() => {
    resetData();
  }, [resetData]);

  useEffect(() => {
    if (isLoading.current || currentBoard) {
      return;
    }

    let getBoard;

    const getCardFromDB = async (cardId) => {
      const getCard = await fetchCard(cardId);
      //it's not a card url either, the user entered a wrong url
      if (getCard === undefined) {
        setCurrentBoard(null);
        setError(true);
      } else {
        history.replace(
          `/c/${match.params.shortLink}/${convertToSlug(getCard.name)}`
        );
        //getting the board for the card
        //if we have the boards already:
        if (boards.length > 0) {
          getBoard = getElementFromKey(boards, getCard.idBoard, "id");
          //otherwise fetch the board for the card as well
        } else {
          getBoard = await fetchBoard(getCard.idBoard);
        }
        setCurrentBoard(getBoard);
        isLoading.current = false;
      }

      return () => {
        resetData();
      };
    };
    const getBoardFromDB = async (boardId) => {
      isLoading.current = true;
      getBoard = getElementFromKey(boards, match.params.shortLink, "shortUrl");
      if (getBoard === undefined) {
        getBoard = await fetchBoard(boardId);
      }
      //it might be a card URL, if it's not a board
      if (getBoard === undefined) {
        getCardFromDB(match.params.shortLink);
      } else {
        setCurrentBoard(getBoard);
        isLoading.current = false;
        history.replace(
          `/b/${match.params.shortLink}/${convertToSlug(getBoard.name)}`
        );
      }
    };

    getBoardFromDB(match.params.shortLink);
  }, [
    boards,
    cards,
    currentBoard,
    setCurrentBoard,
    match,
    history,
    isLoading,
    resetData,
  ]);

  if (error) {
    const type =
      match.params.b === "b"
        ? "board"
        : match.params.b === "c"
        ? "card"
        : "page";
    return (
      <div className="boardSelectionWrapper">
        <ErrorWindow
          message={`Couldn't find the ${type} you're looking for.`}
          callback={resetData}
        />
      </div>
    );
  }

  if (currentBoard === null) {
    return null;
  }

  if (isLoading.current || !hasDataFetched) {
    return (
      <div className="board">
        <Loader />
      </div>
    );
  }

  return (
    <div className="board" ref={boardRef}>
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
});

export const getElementFromKey = (array, id, key) => {
  return array.find((board) => board[key] === id);
};

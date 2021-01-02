import { asyncCatch } from "./handlers.js";
import { updateCard, updateList } from "../utils/updateData.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export function handleDragEnd(result, cards, setCards, lists, setLists) {
  if (!result.destination) return;

  const { source, destination } = result;

  const cardsArrMaster = [...cards];
  try {
    if (source.droppableId === "board") {
      //we are moving an entire list
      const listArr = [...lists];
      const [reorderedItem] = listArr.splice(source.index, 1);
      listArr.splice(destination.index, 0, reorderedItem);
      asyncCatch(
        updateList,
        listArr[destination.index - 1],
        listArr[destination.index],
        listArr[destination.index + 1]
      );
      setLists(listArr);
      //also updating the cards-in-lists array now
      const [reorderedCards] = cardsArrMaster.splice(source.index, 1);
      cardsArrMaster.splice(destination.index, 0, reorderedCards);
      setCards(cardsArrMaster);
    } else {
      //we are moving a card
      const sourceListId = parseInt(source.droppableId.replace("list", ""));
      const destinationListId = parseInt(
        destination.droppableId.replace("list", "")
      );
      const [cardsArrSource] = cardsArrMaster.slice(
        sourceListId,
        sourceListId + 1
      );
      //we'll move a card from this to somewhere else (maybe within the same list or different)
      const [reorderedCard] = cardsArrSource.splice(source.index, 1);
      if (sourceListId === destinationListId) {
        cardsArrSource.splice(destination.index, 0, reorderedCard);
        //replacing the original array with our modified one
        cardsArrMaster.splice(destinationListId, 1, cardsArrSource);
        asyncCatch(
          updateCard,
          lists[destinationListId].id,
          cardsArrSource[destination.index - 1],
          cardsArrSource[destination.index],
          cardsArrSource[destination.index + 1]
        );
        setCards(cardsArrMaster);
      } else {
        //(from one list to another)
        const [cardsArrDestination] = cardsArrMaster.slice(
          destinationListId,
          destinationListId + 1
        );
        cardsArrDestination.splice(destination.index, 0, reorderedCard);
        //now replacing the original with our modified source+destination card arrays
        cardsArrMaster.splice(sourceListId, 1, cardsArrSource);
        cardsArrMaster.splice(destinationListId, 1, cardsArrDestination);
        asyncCatch(
          updateCard,
          lists[destinationListId].id,
          cardsArrDestination[destination.index - 1],
          cardsArrDestination[destination.index],
          cardsArrDestination[destination.index + 1]
        );
        setCards(cardsArrMaster);
      }
    }
  } catch (err) {
    console.log("an error occured while updating");
    console.log(err);
  }
}

export function DroppableBoard(props) {
  return (
    <Droppable droppableId="board" direction="horizontal" type="LISTS">
      {(providedBoardDroppable, snapshotBoardDroppable) => (
        <div
          ref={providedBoardDroppable.innerRef}
          {...providedBoardDroppable.droppableProps}
          className="listsContainer"
        >
          {props.children}
          {providedBoardDroppable.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export function DraggableDroppableList(props) {
  return (
    <Draggable draggableId={props.list.id} index={props.listIndex}>
      {(providedList, snapshotList) => (
        <div
          ref={providedList.innerRef}
          {...providedList.draggableProps}
          {...providedList.dragHandleProps}
        >
          <Droppable droppableId={`list${props.listIndex}`} type="CARDS">
            {(providedListDroppable, snapshotListDroppable) => (
              <div
                ref={providedListDroppable.innerRef}
                {...providedListDroppable.droppableProps}
              >
                {props.children}
                {providedListDroppable.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export function DraggableCard(props) {
  return (
    <Draggable draggableId={props.card.id} index={props.cardIndex}>
      {(providedCard, snapshotCard) => (
        <div
          ref={providedCard.innerRef}
          {...providedCard.draggableProps}
          {...providedCard.dragHandleProps}
        >
          {props.children}
        </div>
      )}
    </Draggable>
  );
}

export function DragMaster({ cards, setCards, lists, setLists, children }) {
  return (
    <DragDropContext
      onDragEnd={(result) => {
        handleDragEnd(result, cards, setCards, lists, setLists);
      }}
    >
      {children}
    </DragDropContext>
  );
}

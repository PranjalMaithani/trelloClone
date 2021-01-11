import { handleKeyDown, useClickOutside, asyncCatch } from "./lib.js";
import { useRef, useContext } from "react";
import { updateCardValue } from "./updateData.js";
import { createModal } from "./lib.js";

import { TrelloCardsContext } from "../resources/dataContext.js";
import ReactDOM from "react-dom";

export const confirmCardUpdate = (
  newName,
  newDesc,
  currentCard,
  cards,
  setCards,
  endingAction
) => {
  asyncCatch(updateCardValue, currentCard.id, newName, newDesc);
  const newCardsArray = [...cards];
  const newSubArray = cards[currentCard.listIndex].map((card) => {
    if (card.id === currentCard.id) {
      const newCard = { ...card };
      newCard.name = newName;
      newCard.desc = newDesc;
      return newCard;
    } else return card;
  });
  newCardsArray.splice(currentCard.listIndex, 1, newSubArray);
  setCards(newCardsArray);
  endingAction();
};

export function CardEditor({ currentCard, disableEditing }) {
  const divId = "modal-root";
  createModal(divId);

  const { cards, setCards } = useContext(TrelloCardsContext);

  const confirmCardRename = (event) => {
    event.preventDefault();
    const newName = event.currentTarget.input.value;
    confirmCardUpdate(
      newName,
      currentCard.desc,
      currentCard,
      cards,
      setCards,
      disableEditing
    );
  };

  const cancelAction = () => {
    disableEditing();
  };

  const cardEditorRef = useRef();
  useClickOutside(cardEditorRef, cancelAction);

  return ReactDOM.createPortal(
    <div
      className="modalOuterCardEditor"
      style={{
        position: "fixed",
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
    >
      <div
        ref={cardEditorRef}
        style={{
          position: "absolute",
          top: currentCard.y,
          left: currentCard.x,
          maxWidth: currentCard.width,
        }}
      >
        <form
          onSubmit={confirmCardRename}
          onKeyDown={(event) => {
            handleKeyDown(event, confirmCardRename, cancelAction);
          }}
        >
          <textarea
            name="input"
            autoFocus
            style={{
              width: currentCard.width,
              height: currentCard.height,
              minHeight: 60,
            }}
            className="cardText modalInnerCardEditor"
            defaultValue={currentCard.name}
          ></textarea>
          <button type="submit" className="cardText confirmButton">
            Confirm
          </button>
          <button
            type="button"
            className="cardText cancelButton"
            onClick={cancelAction}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>,
    document.getElementById(divId)
  );
}

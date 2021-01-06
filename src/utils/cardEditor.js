import { handleKeyDown, useClickOutside, asyncCatch } from "./lib.js";
import { useRef, useState } from "react";
import { updateCardValue } from "./updateData.js";
import ReactDOM from "react-dom";

function createModal(modalRef) {
  modalRef.current = document.getElementById("modal-root");
  if (!modalRef.current) {
    let element = document.createElement("div");
    element.setAttribute("id", "modal-root");
    document.body.appendChild(element);
  }
}

export function CardEditor({ currentCard, disableEditing, cards, setCards }) {
  const cardEditorRef = useRef();
  const modalRef = useRef(null);

  createModal(modalRef);

  const confirmAction = (event) => {
    event.preventDefault();
    const newValue = event.currentTarget.input.value;
    asyncCatch(updateCardValue, currentCard.id, newValue);
    const newCardsArray = [...cards];
    const newSubArray = cards[currentCard.listIndex].map((card) => {
      if (card.id === currentCard.id) return { ...card, name: newValue };
      else return card;
    });
    newCardsArray.splice(currentCard.listIndex, 1, newSubArray);
    setCards(newCardsArray);
    disableEditing();
  };

  const cancelAction = () => {
    disableEditing();
  };

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
          onSubmit={confirmAction}
          onKeyDown={(event) => {
            handleKeyDown(event, confirmAction, cancelAction);
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
    document.getElementById("modal-root")
  );
}

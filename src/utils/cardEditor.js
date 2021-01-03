import { handleKeyDown, useClickOutside, asyncCatch } from "./lib.js";
import { useRef } from "react";
import { updateCardValue } from "./updateData.js";

export function CardEditor({ currentCard, disableEditing, cards, setCards }) {
  const cardEditorRef = useRef();

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

  return (
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
        className="modalInnerCardEditor"
        style={{
          position: "absolute",
          top: currentCard.y,
          left: currentCard.x,
          width: currentCard.width,
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
            className="cardText"
            defaultValue={currentCard.name}
          ></textarea>
          <button type="submit">Confirm</button>
          <button type="button" onClick={cancelAction}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

import { deleteCard } from "../utils/updateData.js";
import { CardEditor } from "../utils/cardEditor.js";
import { CardModal } from "./cardModal.js";
import { useRef, useState, useContext } from "react";
import { TrelloCardsContext } from "../resources/dataContext.js";

export function Card({ card, listIndex }) {
  const cardRef = useRef(null);
  const currentCard = useRef(null); //current card values for editing
  const [isEditing, setIsEditing] = useState(null); //null,editor,modal

  function EditButton() {
    return (
      <button
        className="cardButton editButton"
        onClick={(event) => {
          event.stopPropagation();
          if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const cardValues = {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              name: card.name,
              id: card.id,
              listIndex: listIndex,
            };

            currentCard.current = cardValues;
            setIsEditing("editor");
          }
        }}
      >
        Edit
      </button>
    );
  }

  return (
    <div className="card" ref={cardRef}>
      {isEditing === "modal" && (
        <CardModal
          currentCard={card}
          listIndex={listIndex}
          disableModal={() => {
            setIsEditing(null);
          }}
        />
      )}

      {isEditing === "editor" && (
        <CardEditor
          currentCard={currentCard.current}
          disableEditing={() => {
            setIsEditing(null);
          }}
        />
      )}

      <div
        className="cardWrapper"
        onClick={() => {
          setIsEditing("modal");
        }}
      >
        <li className="cardText">{card.name}</li>
        <div className="cardButtonsWrapper">
          <DeleteButton cardId={card.id} listIndex={listIndex} />
          <EditButton />
        </div>
      </div>
    </div>
  );
}

function DeleteButton({ cardId, listIndex }) {
  const { cards, setCards } = useContext(TrelloCardsContext);
  const deleteFunction = (event) => {
    event.stopPropagation();
    deleteCard(cardId);
    const masterCardsArray = [...cards];
    const [originalArray] = masterCardsArray.splice(listIndex, 1);
    const newCardsInList = originalArray.filter((card) => card.id !== cardId);
    masterCardsArray.splice(listIndex, 0, newCardsInList);
    setCards(masterCardsArray);
  };
  return (
    <button className="cardButton deleteButton" onClick={deleteFunction}>
      X
    </button>
  );
}

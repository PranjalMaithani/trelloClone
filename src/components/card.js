import { deleteCard } from "../utils/updateData.js";
import { CardEditor } from "../utils/cardEditor.js";
import { useRef, useState } from "react";

export function Card({ card, listIndex, cards, setCards }) {
  const cardRef = useRef(null);
  const currentCard = useRef(null); //current card values for editing
  const [isEditing, setIsEditing] = useState(false);

  function EditButton() {
    return (
      <button
        className="cardButton editButton"
        onClick={() => {
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
            setIsEditing(true);
          }
        }}
      >
        Edit
      </button>
    );
  }

  return (
    <div className="card" ref={cardRef}>
      {isEditing && (
        <CardEditor
          currentCard={currentCard.current}
          disableEditing={() => {
            setIsEditing(false);
          }}
          cards={cards}
          setCards={setCards}
        />
      )}
      <div className="cardWrapper">
        <li className="cardText">{card.name}</li>
        <div className="cardButtonsWrapper">
          <DeleteButton
            cardId={card.id}
            listIndex={listIndex}
            cards={cards}
            setCards={setCards}
          />
          <EditButton />
        </div>
      </div>
    </div>
  );
}

function DeleteButton({ cardId, listIndex, cards, setCards }) {
  const deleteFunction = () => {
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

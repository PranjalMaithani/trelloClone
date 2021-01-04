import { deleteCard } from "../utils/updateData.js";
import { useRef } from "react";

export function Card({
  card,
  listIndex,
  cards,
  setCards,
  getCurrentCardValues,
}) {
  const cardRef = useRef(null);

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
            getCurrentCardValues(cardValues);
          }
        }}
      >
        Edit
      </button>
    );
  }

  return (
    <div className="card" ref={cardRef}>
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

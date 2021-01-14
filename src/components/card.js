import { deleteCard } from "../utils/updateData.js";
import { CardEditor } from "../utils/cardEditor.js";
import { CardModal } from "./cardModal.js";
import { useRef, useState, useContext, useEffect } from "react";
import { TrelloCardsContext } from "../resources/dataContext.js";
import { useRouteMatch, Link } from "react-router-dom";
import { convertToSlug } from "../utils/lib";

export function Card({ card, listIndex }) {
  const cardRef = useRef(null);
  const currentCard = useRef(null); //current card values for editing
  const [isEditing, setIsEditing] = useState(null); //null,editor,modal

  let match = useRouteMatch("/c/:shortLink");
  const slugCardName = convertToSlug(card.name);

  //reset data on card load
  useEffect(() => {
    setIsEditing(null);
  }, []);

  useEffect(() => {
    if (match && match.params.shortLink === card.shortLink) {
      setIsEditing("modal");
    }
  }, [card, match]);

  function EditButton() {
    return (
      <button
        className="cardButton editButton"
        onClick={(event) => {
          event.preventDefault();
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
      <div className="cardWrapper">
        <Link to={`/c/${card.shortLink}/${slugCardName}`}>
          <p
            className="cardText"
            onClick={() => {
              setIsEditing("modal");
            }}
          >
            {card.name}
          </p>
        </Link>
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
    event.preventDefault();
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

import { handleKeyDown } from "./handlers.js";
import { deleteCard } from "../utils/updateData.js";

export function Card({ card, listIndex, cards, setCards }) {
  return (
    <div className="card">
      <li>{card.name}</li>
      <DeleteButton
        cardId={card.id}
        listIndex={listIndex}
        cards={cards}
        setCards={setCards}
      />
      <EditButton cardId={card.id} listIndex={listIndex} />
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
  return <button onClick={deleteFunction}>X</button>;
}

function EditButton({ cardId, listIndex, confirmAction, cancelAction }) {
  return <button>E</button>;
}

function ModalCardEditor({
  x,
  y,
  width,
  height,
  card,
  cancelAction,
  confirmAction,
}) {
  return (
    <div className="modalOuter">
      <div className="modalInner">
        <form
          onSubmit={confirmAction}
          onKeyDown={(event) => {
            handleKeyDown(event, confirmAction, cancelAction);
          }}
        >
          <textarea name="input" value={card.name} autoFocus></textarea>
          <button type="submit">Confirm</button>
          <button type="button" onClick={cancelAction}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { addCard } from "../utils/createData.js";
import { handleKeyDown, useClickOutside } from "../utils/lib.js";

export function List(props) {
  const [editing, setEditing] = useState(false);

  const cancelAction = () => {
    setEditing(false);
  };

  const confirmAction = async (event) => {
    event.preventDefault();
    const cardEditorText = event.currentTarget.input.value;
    setEditing(false);

    if (cardEditorText === "") return;

    const newCard = await addCard(props.id, cardEditorText);
    const tempArr = [...props.cards];
    tempArr[props.index].push(newCard);
    props.setCards(tempArr);
  };

  const enableEditing = () => {
    setEditing((prevState) => !prevState);
  };

  return (
    <div className="list">
      <p>{props.name}</p>
      {props.children}
      <div>
        {!editing && <AddCardButton enableEditing={enableEditing} />}
        {editing && (
          <NewCardInput
            confirmAction={confirmAction}
            cancelAction={cancelAction}
          />
        )}
      </div>
    </div>
  );
}

function AddCardButton({ enableEditing }) {
  return <span onClick={enableEditing}> + Add another card</span>;
}

function NewCardInput({ confirmAction, cancelAction }) {
  const formRef = useRef();
  useClickOutside(formRef, cancelAction);
  return (
    <form
      ref={formRef}
      onSubmit={confirmAction}
      onKeyDown={(event) => {
        handleKeyDown(event, confirmAction, cancelAction);
      }}
    >
      <textarea
        name="input"
        placeholder="Enter a title for this card..."
        autoFocus
      ></textarea>
      <button type="submit">Add Card</button>
      <button type="button" onClick={cancelAction}>
        Cancel
      </button>
    </form>
  );
}

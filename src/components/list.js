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
      <div className="listHeader">
        <span className="listTitle">{props.name}</span>
      </div>
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
  return (
    <span className="addButton addCardButton" onClick={enableEditing}>
      {" "}
      + Add another card
    </span>
  );
}

function NewCardInput({ confirmAction, cancelAction }) {
  const formRef = useRef();
  useClickOutside(formRef, cancelAction);
  return (
    <form
      className="newCardInput"
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
        className="cardText modalInnerCardEditor addCardModal"
      ></textarea>
      <button type="submit" className="confirmButton">
        Add Card
      </button>
      <button type="button" className="cancelButton" onClick={cancelAction}>
        Cancel
      </button>
    </form>
  );
}

export function AddListButton() {
  const [enabled, setEnabled] = useState(false);

  const confirmAction = () => {};

  const cancelAction = () => {
    setEnabled(false);
  };

  const addListButtonRef = useRef();
  useClickOutside(addListButtonRef, cancelAction);

  return enabled ? (
    <div>
      <form
        className="newCardInput"
        ref={addListButtonRef}
        onSubmit={confirmAction}
        onKeyDown={(event) => {
          handleKeyDown(event, confirmAction, cancelAction);
        }}
      >
        <textarea
          name="input"
          placeholder="Enter list title..."
          autoFocus
          className="cardText modalInnerCardEditor addCardModal"
        ></textarea>
        <button type="submit" className="confirmButton">
          Add List
        </button>
        <button type="button" className="cancelButton" onClick={cancelAction}>
          X
        </button>
      </form>
    </div>
  ) : (
    <span
      className="addButton addListButton"
      onClick={() => {
        setEnabled((prevState) => !prevState);
      }}
    >
      {" "}
      + Add another list
    </span>
  );
}

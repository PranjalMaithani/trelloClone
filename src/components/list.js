import { useState, useRef, useEffect } from "react";
import { addCard, addList } from "../utils/createData.js";
import { updateListValue } from "../utils/updateData.js";
import { archiveList } from "../utils/updateData.js";
import { handleKeyDown, useClickOutside, asyncCatch } from "../utils/lib.js";

export function List(props) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const listRenameRef = useRef(null);
  const [listNameHeight, setListNameHeight] = useState(0);

  useEffect(() => {
    if (listRenameRef.current) {
      setListNameHeight(
        window
          .getComputedStyle(listRenameRef.current)
          .getPropertyValue("height")
      );
    }
  }, [listRenameRef]);

  const cancelAction = () => {
    setIsAddingCard(false);
  };

  const confirmAction = async (event) => {
    event.preventDefault();
    const cardEditorText = event.currentTarget.input.value;
    setIsAddingCard(false);

    if (cardEditorText === "") return;

    const newCard = await addCard(props.id, cardEditorText);
    const tempArr = [...props.cards];
    tempArr[props.index].push(newCard);
    props.setCards(tempArr);
  };

  const enableEditing = () => {
    setIsAddingCard((prevState) => !prevState);
  };

  const deleteList = async (listId, listIndex) => {
    const masterListsArray = [...props.lists];
    const filteredLists = masterListsArray.filter((list) => list.id !== listId);
    props.setLists(filteredLists);

    const masterCardsArray = [...props.cards];
    masterCardsArray.splice(listIndex, 1);
    props.setCards(masterCardsArray);
    await archiveList(listId);
  };

  const DeleteButton = () => {
    return (
      <button
        className="cardButton listButton deleteButton"
        onClick={() => {
          deleteList(props.id, props.index);
        }}
      >
        X
      </button>
    );
  };

  const EditButton = () => {
    return (
      <button
        className="cardButton listButton editButton"
        onClick={() => {
          setRenaming(true);
        }}
      >
        Edit
      </button>
    );
  };

  const confirmListRename = (event) => {
    const newValue = event.currentTarget.value;
    if (newValue === "") {
      setRenaming(false);
      return;
    }
    asyncCatch(updateListValue, props.id, newValue);
    const newListsArray = props.lists.map((list) => {
      if (list.id === props.id) return { ...list, name: newValue };
      else return list;
    });
    props.setLists(newListsArray);
    setRenaming(false);
  };

  // useClickOutside(listRenameRef, confirmListRename);

  return (
    <div className="list">
      {!renaming ? (
        <div className="listHeader" ref={listRenameRef}>
          <span className="cardText listTitle">{props.name}</span>
          <div className="cardButtonsWrapper">
            <DeleteButton />
            <EditButton />
          </div>
        </div>
      ) : (
        <div className="listHeader">
          <textarea
            name="input"
            defaultValue={props.name}
            autoFocus
            className="cardText listTitle listEditor"
            style={{ height: listNameHeight }}
            onKeyDown={(event) => {
              handleKeyDown(event, confirmListRename, confirmListRename);
            }}
            onChange={(event) => {
              setListNameHeight(event.currentTarget.scrollHeight);
            }}
          ></textarea>
        </div>
      )}
      <div className="listCards">{props.children}</div>
      <div>
        {!isAddingCard && <AddCardButton enableEditing={enableEditing} />}
        {isAddingCard && (
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

export function AddListField({ boardId, setLists, setCards }) {
  const [enabled, setEnabled] = useState(false);

  const confirmAction = async (event) => {
    event.preventDefault();
    const listName = event.currentTarget.input.value;

    if (listName === "") return;

    setEnabled(false);
    const newList = await addList(boardId, listName);
    setLists((prevState) => [...prevState, newList]);
    setCards((prevState) => [...prevState, []]);
  };

  const cancelAction = () => {
    setEnabled(false);
  };

  const AddListInput = () => {
    const addListButtonRef = useRef();
    useClickOutside(addListButtonRef, cancelAction);

    return (
      <div>
        <form
          ref={addListButtonRef}
          className="newListInput"
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
    );
  };

  return enabled ? (
    <AddListInput />
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

import { useState, useRef, useContext } from "react";
import { addCard, addList } from "../utils/createData.js";
import { updateListValue } from "../utils/updateData.js";
import { archiveList } from "../utils/updateData.js";
import { handleKeyDown, useClickOutside, asyncCatch } from "../utils/lib.js";
import { RenameTextArea } from "./renameTextArea.js";
import {
  TrelloListsContext,
  TrelloCardsContext,
} from "../resources/dataContext.js";
import { DraggableDroppableList } from "./dragAndDropComponents";

export function List(props) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const listRenameRef = useRef(null);

  const { lists, setLists } = useContext(TrelloListsContext);
  const { cards, setCards } = useContext(TrelloCardsContext);

  const cancelAction = () => {
    setIsAddingCard(false);
  };

  const confirmAction = async (event) => {
    event.preventDefault();
    const cardEditorText = event.currentTarget.input.value;
    event.currentTarget.input.value = "";

    if (cardEditorText === "") return;

    const newCard = await addCard(props.id, cardEditorText);
    const tempArr = [...cards];
    tempArr[props.index].push(newCard);
    setCards(tempArr);
  };

  const enableEditing = () => {
    setIsAddingCard((prevState) => !prevState);
  };

  const deleteList = async (listId, listIndex) => {
    const masterListsArray = [...lists];
    const filteredLists = masterListsArray.filter((list) => list.id !== listId);
    setLists(filteredLists);

    const masterCardsArray = [...cards];
    masterCardsArray.splice(listIndex, 1);
    setCards(masterCardsArray);
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
          setIsRenaming(true);
        }}
      >
        Edit
      </button>
    );
  };

  const confirmListRename = () => {
    if (!listRenameRef.current) return;

    const newValue = listRenameRef.current.value;
    if (newValue === "") {
      setIsRenaming(false);
      return;
    }
    asyncCatch(updateListValue, props.id, newValue);
    const newListsArray = lists.map((list) => {
      if (list.id === props.id) return { ...list, name: newValue };
      else return list;
    });
    setLists(newListsArray);
    setIsRenaming(false);
  };

  return (
    <div className="list">
      {!isRenaming ? (
        <div className="listHeader">
          <span className="cardText listTitle">{props.name}</span>
          <div className="cardButtonsWrapper">
            <DeleteButton />
            <EditButton />
          </div>
        </div>
      ) : (
        <div className="listHeader">
          <RenameTextArea
            defaultValue={props.name}
            confirmAction={confirmListRename}
            classes="listEditor cardText listTitle"
            ref={listRenameRef}
            isPressEnterToSubmit={true}
          />
        </div>
      )}
      <div className="listCards">{props.children}</div>
      <div>
        {!isAddingCard && <AddCardButton enableEditing={enableEditing} />}
      </div>

      {isAddingCard && (
        <NewCardInput
          confirmAction={confirmAction}
          cancelAction={cancelAction}
        />
      )}
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

export function AddListField({ boardId }) {
  const [enabled, setEnabled] = useState(false);
  const { setLists } = useContext(TrelloListsContext);
  const { setCards } = useContext(TrelloCardsContext);

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

export const ListNameFromId = (id) => {
  const { lists } = useContext(TrelloListsContext);
  const listObj = lists.find((list) => list.id === id);
  return listObj.name;
};

import { useClickOutside, createModal } from "../utils/lib.js";
import { useRef, useContext, useState, useEffect } from "react";
import { confirmCardUpdate } from "../utils/cardEditor";
import { ListNameFromId } from "./list";
import { RenameTextArea } from "./renameTextArea";

import { TrelloCardsContext } from "../resources/dataContext.js";
import ReactDOM from "react-dom";

export const CardModal = ({ currentCard, disableModal, listIndex }) => {
  const divId = "modal-root";
  createModal(divId);

  const { cards, setCards } = useContext(TrelloCardsContext);
  const modalTitleRef = useRef();
  const modalDescRef = useRef();
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    const cancelAllActions = (event) => {
      if (event.key === "Escape") {
        if (isEditing === "desc") {
          setIsEditing(null);
        } else {
          disableModal();
        }
      }
    };
    document.addEventListener("keydown", cancelAllActions);
    return () => {
      document.removeEventListener("keydown", cancelAllActions);
    };
  }, [isEditing, disableModal]);

  const startEditingDesc = (event) => {
    event.stopPropagation();
    setIsEditing("desc");
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  const confirmTitleUpdate = () => {
    const newName = modalTitleRef.current.value;
    confirmCardUpdate(
      newName,
      currentCard.desc,
      { ...currentCard, listIndex: listIndex },
      cards,
      setCards,
      cancelEditing
    );
  };

  const confirmDescUpdate = () => {
    const newValue = modalDescRef.current.value;
    confirmCardUpdate(
      currentCard.name,
      newValue,
      { ...currentCard, listIndex: listIndex },
      cards,
      setCards,
      cancelEditing
    );
  };

  const cardModalRef = useRef();
  useClickOutside(cardModalRef, () => {
    if (isEditing === null) {
      disableModal();
    }
  });

  return ReactDOM.createPortal(
    <div
      className="modalOuterCardEditor"
      style={{
        position: "fixed",
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
    >
      <div ref={cardModalRef} className="cardModal">
        {isEditing === "title" ? (
          <RenameTextArea
            defaultValue={currentCard.name}
            confirmAction={confirmTitleUpdate}
            classes="listEditor cardText listTitle"
            ref={modalTitleRef}
            isPressEnterToSubmit={true}
          />
        ) : (
          <h3
            className="cardText listTitle"
            style={{ fontSize: 20, fontWeight: 800 }}
            onClick={(event) => {
              event.stopPropagation();
              setIsEditing("title");
            }}
          >
            {currentCard.name}
          </h3>
        )}
        <p>
          in list <u>{ListNameFromId(currentCard.idList)}</u>
        </p>
        <h3>Description</h3>
        {currentCard.desc && (
          <div style={{ minHeight: 50 }}>
            {isEditing !== "desc" && (
              <button onClick={startEditingDesc} className="cancelButton">
                Edit
              </button>
            )}
          </div>
        )}
        <div>
          {isEditing !== "desc" && (
            <p className="cardText cardDesc" onClick={startEditingDesc}>
              {currentCard.desc
                ? currentCard.desc
                : "Add a more detailed description..."}
            </p>
          )}
          {isEditing === "desc" && (
            <>
              <RenameTextArea
                defaultValue={currentCard.desc}
                confirmAction={confirmDescUpdate}
                classes="modalInnerCardEditor cardText listEditor cardDesc"
                ref={modalDescRef}
                isPressEnterToSubmit={false}
              />
              <button
                className="cardText confirmButton"
                onClick={confirmDescUpdate}
              >
                Confirm
              </button>
              <button
                type="button"
                className="cardText cancelButton"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.getElementById(divId)
  );
};

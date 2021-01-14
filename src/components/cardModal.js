import { useClickOutside, createModal, convertToSlug } from "../utils/lib.js";
import { useRef, useContext, useState, useEffect } from "react";
import { confirmCardUpdate } from "../utils/cardEditor";
import { ListNameFromId } from "./list";
import { RenameTextArea } from "./renameTextArea";

import {
  TrelloBoardsContext,
  TrelloCardsContext,
} from "../resources/dataContext.js";
import { getElementFromKey } from "./board.js";
import { Redirect, useRouteMatch } from "react-router-dom";

import ReactDOM from "react-dom";

export const CardModal = ({ currentCard, listIndex, disableModal }) => {
  let match = useRouteMatch("/:b/:shortLink");

  const divId = "modal-root";
  createModal(divId);

  const { cards, setCards } = useContext(TrelloCardsContext);
  const { boards } = useContext(TrelloBoardsContext);

  const modalTitleRef = useRef();
  const modalDescRef = useRef();
  const [isEditing, setIsEditing] = useState(null);
  const [isModalActive, setIsModalActive] = useState(true);

  useEffect(() => {
    if (!isModalActive) {
      setIsEditing(null);
      disableModal();
    }
  }, [isModalActive, disableModal]);

  useEffect(() => {
    const cancelAllActions = (event) => {
      if (event.key === "Escape") {
        if (isEditing !== null) {
          setIsEditing(null);
        } else {
          setIsModalActive(false);
        }
      }
    };
    document.addEventListener("keydown", cancelAllActions);
    return () => {
      document.removeEventListener("keydown", cancelAllActions);
    };
  }, [isEditing]);

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
      setIsModalActive(false);
    }
  });

  if (!isModalActive || match.params.b !== "c") {
    const board = getElementFromKey(boards, currentCard.idBoard, "id");
    return (
      <Redirect to={`/b/${board.shortLink}/${convertToSlug(board.name)}`} />
    );
  }

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
            classes="listEditor cardText listTitle cardHeading"
            ref={modalTitleRef}
            isPressEnterToSubmit={true}
          />
        ) : (
          <h3
            className="cardText listTitle cardHeading"
            onClick={(event) => {
              event.stopPropagation();
              setIsEditing("title");
            }}
          >
            {currentCard.name}
          </h3>
        )}
        <p className="cardText quietText">
          in list <u>{ListNameFromId(currentCard.idList)}</u>
        </p>
        <br></br>
        <div style={{ display: "flex", alignItems: "center", minHeight: 50 }}>
          <h3>Description</h3>
          {currentCard.desc && (
            <>
              {isEditing !== "desc" && (
                <button
                  onClick={startEditingDesc}
                  className="cardText editDescButton"
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
        <div>
          {isEditing !== "desc" && (
            <p
              className={`cardText cardDesc ${
                !currentCard.desc && "cardDescButton"
              }`}
              onClick={startEditingDesc}
            >
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

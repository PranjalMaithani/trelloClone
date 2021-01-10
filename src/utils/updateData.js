import { apiKey } from "../resources/apiContext";

import { getToken } from "../resources/token";

function averagePosition(card1, cardDragging, card2) {
  if (card1 === undefined && card2 === undefined) return cardDragging.pos;
  else if (card1 === undefined) return card2.pos / 2;
  else if (card2 === undefined) return card1.pos + cardDragging.pos / 2;
  else return (card1.pos + card2.pos) / 2;
}

export async function updateCardPosition(
  listId,
  prevCard,
  currentCard,
  nextCard
) {
  const newPos = averagePosition(prevCard, currentCard, nextCard);
  await fetch(
    `https://api.trello.com/1/cards/${
      currentCard.id
    }?key=${apiKey}&token=${getToken()}&idList=${listId}&pos=${newPos}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return;
}

export async function updateCardValue(cardId, value) {
  await fetch(
    `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${getToken()}&name=${value}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return;
}

export async function updateListValue(listId, value) {
  await fetch(
    `https://api.trello.com/1/lists/${listId}?key=${apiKey}&token=${getToken()}&name=${value}`,
    {
      method: "PUT",
    }
  );
  return;
}

export async function updateList(prevList, currentList, nextList) {
  const newPos = averagePosition(prevList, currentList, nextList);
  await fetch(
    `https://api.trello.com/1/lists/${
      currentList.id
    }?key=${apiKey}&token=${getToken()}&pos=${newPos}`,
    {
      method: "PUT",
    }
  );
  return;
}

export async function updateBoard(boardId, value) {
  await fetch(
    `https://api.trello.com/1/boards/${boardId}?key=${apiKey}&token=${getToken()}&name=${value}`,
    {
      method: "PUT",
    }
  );
  return;
}

export async function deleteCard(cardId) {
  await fetch(
    `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${getToken()}`,
    {
      method: "DELETE",
    }
  );
}

export async function archiveList(listId) {
  await fetch(
    `https://api.trello.com/1/lists/${listId}/closed?key=${apiKey}&token=${getToken()}&value=true`,
    {
      method: "PUT",
    }
  );
  return;
}

export async function deleteBoard(boardId) {
  await fetch(
    `https://api.trello.com/1/boards/${boardId}?key=${apiKey}&token=${getToken()}`,
    {
      method: "DELETE",
    }
  );
  return;
}

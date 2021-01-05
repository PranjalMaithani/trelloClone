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
    `https://api.trello.com/1/cards/${currentCard.id}?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}&idList=${listId}&pos=${newPos}`,
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
    `https://api.trello.com/1/cards/${cardId}?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}&name=${value}`,
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
    `https://api.trello.com/1/lists/${listId}?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}&name=${value}`,
    {
      method: "PUT",
    }
  );
  return;
}

export async function updateList(prevList, currentList, nextList) {
  const newPos = averagePosition(prevList, currentList, nextList);
  await fetch(
    `https://api.trello.com/1/lists/${currentList.id}?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}&pos=${newPos}`,
    {
      method: "PUT",
    }
  );
  return;
}

export async function deleteCard(cardId) {
  await fetch(
    `https://api.trello.com/1/cards/${cardId}?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}`,
    {
      method: "DELETE",
    }
  );
}

export async function archiveList(listId) {
  await fetch(
    `https://api.trello.com/1/lists/${listId}/closed?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}&value=true`,
    {
      method: "PUT",
    }
  );
  return;
}

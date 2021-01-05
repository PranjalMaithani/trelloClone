export async function addCard(listId, name) {
  const newCard = await fetch(
    `https://api.trello.com/1/cards?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}&idList=${listId}&name=${name}&pos=bottom`,
    {
      method: "POST",
    }
  );
  const parsedCard = await newCard.json();
  return parsedCard;
}

export async function addList(boardId, name) {
  const newList = await fetch(
    `https://api.trello.com/1/lists?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}&name=${name}&idBoard=${boardId}&pos=bottom`,
    {
      method: "POST",
    }
  );
  const parsedList = await newList.json();
  return parsedList;
}

export async function addCard(listId, name) {
  const newCard = await fetch(
    `https://api.trello.com/1/cards?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}&idList=${listId}&name=${name}`,
    {
      method: "POST",
    }
  );
  const parsedCard = await newCard.json();
  return parsedCard;
}

export async function addList() {}

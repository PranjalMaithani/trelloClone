import { apiKey } from "../resources/apiContext";
import { getToken } from "../resources/token";

export async function addCard(listId, name) {
  const newCard = await fetch(
    `https://api.trello.com/1/cards?key=${apiKey}&token=${getToken()}&idList=${listId}&name=${name}&pos=bottom`,
    {
      method: "POST",
    }
  );
  const parsedCard = await newCard.json();
  return parsedCard;
}

export async function addList(boardId, name) {
  const newList = await fetch(
    `https://api.trello.com/1/lists?key=${apiKey}&token=${getToken()}&name=${name}&idBoard=${boardId}&pos=bottom`,
    {
      method: "POST",
    }
  );
  const parsedList = await newList.json();
  return parsedList;
}

export async function addBoard(name) {
  const newBoard = await fetch(
    `https://api.trello.com/1/boards/?key=${apiKey}&token=${getToken()}&name=${name}`,
    {
      method: "POST",
    }
  );
  const parsedBoard = await newBoard.json();
  return parsedBoard;
}

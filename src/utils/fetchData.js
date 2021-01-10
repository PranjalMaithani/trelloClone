import { apiKey } from "../resources/apiContext";
import { getToken } from "../resources/token";

export async function fetchBoards() {
  const fetchedBoards = await fetch(
    `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${getToken()}`
  );
  const boards = await fetchedBoards.json();
  return boards;
}

export async function fetchBoardLists(boardId) {
  const fetchedLists = await fetch(
    `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${getToken()}`
  );
  const lists = await fetchedLists.json();
  return lists;
}

export async function fetchBoardCards(boardId) {
  const fetchedCards = await fetch(
    `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${getToken()}`
  );
  const cards = await fetchedCards.json();
  return cards;
}

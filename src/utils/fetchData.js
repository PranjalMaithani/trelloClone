import { apiKey } from "../resources/apiContext";
import { getToken } from "../resources/token";

export async function fetchBoards() {
  try {
    const fetchedBoards = await fetch(
      `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${getToken()}`
    );
    const boards = await fetchedBoards.json();
    return boards;
  } catch (err) {
    alert("Couldn't find your boards. Are you connected to the internet?");
  }
}

export async function fetchBoardLists(boardId) {
  try {
    const fetchedLists = await fetch(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${getToken()}`
    );
    const lists = await fetchedLists.json();
    return lists;
  } catch (err) {
    alert("Failed to connect to server");
  }
}

export async function fetchBoardCards(boardId) {
  try {
    const fetchedCards = await fetch(
      `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${getToken()}`
    );
    const cards = await fetchedCards.json();
    return cards;
  } catch (err) {
    alert("Failed to connect to server");
  }
}

export async function fetchCard(id) {
  try {
    const fetchedCard = await fetch(
      `https://api.trello.com/1/cards/${id}?key=${apiKey}&token=${getToken()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const card = await fetchedCard.json();
    return card;
  } catch (err) {
    return undefined;
  }
}

export async function fetchBoard(id) {
  try {
    const fetchedBoard = await fetch(
      `https://api.trello.com/1/boards/${id}?key=${apiKey}&token=${getToken()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const board = await fetchedBoard.json();
    return board;
  } catch (err) {
    return undefined;
  }
}

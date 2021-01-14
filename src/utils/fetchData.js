import { apiKey } from "../resources/apiContext";
import { getToken } from "../resources/token";
import { setError, resetError } from "../resources/errorRecorder";

export async function fetchBoards() {
  try {
    resetError();
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
    resetError();
    const fetchedLists = await fetch(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${getToken()}`
    );
    const lists = await fetchedLists.json();
    return lists;
  } catch (err) {
    setError({
      message:
        "Couldn't find the board you're looking for. Make sure the URL is correct.",
      data: err,
    });
  }
}

export async function fetchBoardCards(boardId) {
  try {
    resetError();
    const fetchedCards = await fetch(
      `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${getToken()}`
    );
    const cards = await fetchedCards.json();
    return cards;
  } catch (err) {
    setError({
      message:
        "Couldn't find the board you're looking for. Make sure the URL is correct.",
      data: err,
    });
    console.log(err);
  }
}

export async function fetchCard(id) {
  try {
    resetError();
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
    setError({
      message:
        "Couldn't find the card you're looking for. Make sure the URL is correct.",
      data: err,
    });
    console.log(err);
    return undefined;
  }
}

export async function fetchBoard(id) {
  try {
    resetError();
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
    setError({
      message:
        "Couldn't find the card you're looking for. Make sure the URL is correct.",
      data: err,
    });
    console.log(err);
    return undefined;
  }
}

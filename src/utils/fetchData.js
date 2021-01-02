export async function fetchBoards() {
  const fetchedBoards = await fetch(
    `https://api.trello.com/1/members/me/boards?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}`
  );
  const boards = await fetchedBoards.json();
  return boards;
}

export async function fetchBoardLists(boardId) {
  const fetchedLists = await fetch(
    `https://api.trello.com/1/boards/${boardId}/lists?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}`
  );
  const lists = await fetchedLists.json();
  return lists;
}

export async function fetchBoardCards(boardId) {
  const fetchedCards = await fetch(
    `https://api.trello.com/1/boards/${boardId}/cards?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}`
  );
  const cards = await fetchedCards.json();
  return cards;
}

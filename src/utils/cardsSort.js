export function filterCardsArray(lists, cards) {
  const cardsArr = Array.from(Array(lists.length), () => []);
  let currentList = 0;
  let currentCard = 0;
  while (lists[currentList] && cards[currentCard]) {
    if (lists[currentList].id === cards[currentCard].idList) {
      cardsArr[currentList].push(cards[currentCard]);
      currentCard++;
    } else {
      currentList++;
    }
  }

  const sortedCardsArr = cardsArr.map((listCards) =>
    listCards.sort(sortByCardPosition)
  );
  return sortedCardsArr;
}

function sortByCardPosition(a, b) {
  return a.pos - b.pos;
}

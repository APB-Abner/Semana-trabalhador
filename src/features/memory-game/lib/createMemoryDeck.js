import shuffleCards from './shuffleCards.js';

export default function createMemoryDeck(cardPairs, pairCount) {
  const selectedPairs = cardPairs.slice(0, pairCount);
  const deck = selectedPairs.flatMap((card) => [
    { ...card, instanceId: `${card.id}-a` },
    { ...card, instanceId: `${card.id}-b` },
  ]);

  return shuffleCards(deck);
}

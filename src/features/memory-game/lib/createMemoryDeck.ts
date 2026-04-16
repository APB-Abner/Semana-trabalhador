import shuffleCards from './shuffleCards.js';
import type { MemoryCardInstance, MemoryCardPair } from '../../../shared/types/learning';

export default function createMemoryDeck(
  cardPairs: MemoryCardPair[],
  pairCount: number,
): MemoryCardInstance[] {
  const selectedPairs = cardPairs.slice(0, pairCount);
  const deck: MemoryCardInstance[] = selectedPairs.flatMap((card) => [
    { ...card, instanceId: `${card.id}-a` },
    { ...card, instanceId: `${card.id}-b` },
  ]);

  return shuffleCards(deck) as MemoryCardInstance[];
}

import { PIGEON_ACCESSORY_SLOTS } from './types';
import type {
  EquippedPigeonAccessories,
  PigeonAccessoryDefinition,
  PigeonAccessoryId,
  PigeonAccessorySlot,
} from './types';

export const PIGEON_ACCESSORY_SLOT_LABELS: Record<PigeonAccessorySlot, string> = {
  head: 'Cabeca',
  face: 'Rosto',
  neck: 'Pescoco',
  body: 'Roupa',
  hand: 'Item',
  extra: 'Extra',
};

export const PIGEON_ACCESSORIES: PigeonAccessoryDefinition[] = [
  { id: 'rally-cap', slot: 'head', name: 'Bone', label: 'Bone', description: 'Bone baixo com aba curta e leitura forte no lobby.', visualWeight: 'medium', tags: ['casual', 'gamer'] },
  { id: 'neon-headphones', slot: 'head', name: 'Headphone neon', label: 'Headphone', description: 'Arco grosso e conchas laterais que deixam olhos e bico livres.', visualWeight: 'strong', tags: ['gamer', 'music'] },
  { id: 'pop-crown', slot: 'head', name: 'Chifre pop', label: 'Chifre pop', description: 'Chifre alto com faixa e volume de cabelo para o preset fashion.', visualWeight: 'medium', tags: ['fashion', 'rare'] },
  { id: 'pirate-bandana', slot: 'head', name: 'Bandana pirata', label: 'Bandana', description: 'Bandana compacta, sem esconder a testa inteira.', visualWeight: 'medium', tags: ['pirate'] },
  { id: 'explorer-hat', slot: 'head', name: 'Chapeu explorador', label: 'Explorador', description: 'Chapeu largo com copa baixa e faixa grossa.', visualWeight: 'medium', tags: ['explorer'] },
  { id: 'gala-top-hat', slot: 'head', name: 'Cartola', label: 'Cartola', description: 'Cartola baixa para nao estourar a area do avatar.', visualWeight: 'medium', tags: ['gala', 'formal'] },
  { id: 'round-glasses', slot: 'face', name: 'Oculos professor', label: 'Oculos', description: 'Aros grandes e grossos alinhados aos olhos do pombo.', visualWeight: 'light', tags: ['professor', 'office'] },
  { id: 'visor-glasses', slot: 'face', name: 'Oculos gamer', label: 'Visor', description: 'Visor grosso de alto contraste com detalhe neon.', visualWeight: 'medium', tags: ['gamer'] },
  { id: 'heart-glasses', slot: 'face', name: 'Oculos coracao', label: 'Coracao', description: 'Oculos pop com lentes grandes e silhueta clara.', visualWeight: 'strong', tags: ['fashion', 'pop'] },
  { id: 'star-glasses', slot: 'face', name: 'Oculos estrela', label: 'Estrela', description: 'Oculos expressivo para visual pop.', visualWeight: 'strong', tags: ['fashion', 'pop'] },
  { id: 'eye-patch', slot: 'face', name: 'Tapa-olho', label: 'Tapa-olho', description: 'Tapa-olho lateral com faixa diagonal leve.', visualWeight: 'medium', tags: ['pirate'] },
  { id: 'monocle', slot: 'face', name: 'Oculos gala', label: 'Oculos gala', description: 'Lente escura social com barra grossa para leitura pequena.', visualWeight: 'light', tags: ['gala', 'formal'] },
  { id: 'office-tie', slot: 'neck', name: 'Gravata', label: 'Gravata', description: 'Gravata curta centralizada no peito.', visualWeight: 'light', tags: ['office', 'professor', 'formal'] },
  { id: 'gold-chain', slot: 'neck', name: 'Corrente', label: 'Corrente', description: 'Corrente grossa com poucos elos para legibilidade.', visualWeight: 'medium', tags: ['fashion', 'pirate'] },
  { id: 'bow-tie', slot: 'neck', name: 'Gravata borboleta', label: 'Borboleta', description: 'Borboleta central para visual social.', visualWeight: 'light', tags: ['gala', 'formal'] },
  { id: 'explorer-bandana', slot: 'neck', name: 'Lenco explorador', label: 'Lenco', description: 'Lenco triangular pequeno no pescoco.', visualWeight: 'medium', tags: ['explorer'] },
  { id: 'gamer-hoodie', slot: 'body', name: 'Moletom gamer', label: 'Moletom', description: 'Moletom curto que preserva peito, asas e silhueta.', visualWeight: 'strong', tags: ['gamer'] },
  { id: 'professor-cardigan', slot: 'body', name: 'Cardigan', label: 'Cardigan', description: 'Casaco simples com gola em V e bolsos grandes.', visualWeight: 'medium', tags: ['professor', 'office'] },
  { id: 'pop-jacket', slot: 'body', name: 'Peito pop', label: 'Peito pop', description: 'Camada felpuda com borda recortada e ombros destacados.', visualWeight: 'strong', tags: ['fashion', 'pop'] },
  { id: 'pirate-sash', slot: 'body', name: 'Faixa pirata', label: 'Faixa', description: 'Faixa diagonal que deixa o corpo reconhecivel.', visualWeight: 'medium', tags: ['pirate'] },
  { id: 'explorer-vest', slot: 'body', name: 'Colete explorador', label: 'Colete', description: 'Colete com bolsos grandes e poucos detalhes.', visualWeight: 'medium', tags: ['explorer'] },
  { id: 'gala-jacket', slot: 'body', name: 'Traje social', label: 'Social', description: 'Blazer curto com lapelas simples.', visualWeight: 'strong', tags: ['gala', 'formal'] },
  { id: 'game-controller', slot: 'hand', name: 'Controle', label: 'Controle', description: 'Controle pequeno preso a asa direita.', visualWeight: 'medium', tags: ['gamer'] },
  { id: 'lesson-book', slot: 'hand', name: 'Caderno', label: 'Caderno', description: 'Caderno aberto com lapis lateral de leitura forte.', visualWeight: 'medium', tags: ['professor'] },
  { id: 'pop-microphone', slot: 'hand', name: 'Microfone', label: 'Microfone', description: 'Microfone de palco com cabo curto.', visualWeight: 'medium', tags: ['fashion', 'pop'] },
  { id: 'treasure-map', slot: 'hand', name: 'Mapa do tesouro', label: 'Mapa', description: 'Pergaminho com X grande, sem texto miudo.', visualWeight: 'medium', tags: ['pirate'] },
  { id: 'compass', slot: 'hand', name: 'Lupa', label: 'Lupa', description: 'Lupa circular grande inspirada no preset explorador.', visualWeight: 'medium', tags: ['explorer'] },
  { id: 'gala-cane', slot: 'hand', name: 'Taca', label: 'Taca', description: 'Taca social lateral com haste fina.', visualWeight: 'light', tags: ['gala', 'formal'] },
  { id: 'sparkle-burst', slot: 'extra', name: 'Brilhos', label: 'Brilhos', description: 'Poucos brilhos no contorno.', visualWeight: 'light', tags: ['fashion', 'gala'] },
  { id: 'chalk-stars', slot: 'extra', name: 'Estrelas de quadro', label: 'Estrelas', description: 'Marcas pequenas lembrando giz.', visualWeight: 'light', tags: ['professor'] },
  { id: 'map-pin', slot: 'extra', name: 'Marcador', label: 'Marcador', description: 'Marcador lateral de exploracao.', visualWeight: 'light', tags: ['explorer'] },
];

export const PIGEON_ACCESSORIES_BY_ID: Record<PigeonAccessoryId, PigeonAccessoryDefinition> =
  Object.fromEntries(PIGEON_ACCESSORIES.map((accessory) => [accessory.id, accessory]));

export function getPigeonAccessoriesBySlot(slot: PigeonAccessorySlot) {
  return PIGEON_ACCESSORIES.filter((accessory) => accessory.slot === slot);
}

export function getPigeonAccessoryById(id: PigeonAccessoryId | null | undefined) {
  return id ? PIGEON_ACCESSORIES_BY_ID[id] ?? null : null;
}

export function isPigeonAccessorySlot(value: unknown): value is PigeonAccessorySlot {
  return typeof value === 'string' && PIGEON_ACCESSORY_SLOTS.includes(value as PigeonAccessorySlot);
}

export function isAccessoryAllowedInSlot(slot: PigeonAccessorySlot, id: PigeonAccessoryId | null | undefined) {
  const accessory = getPigeonAccessoryById(id);
  return Boolean(accessory && accessory.slot === slot);
}

export function hasAccessoryConflict(id: PigeonAccessoryId, equipped: EquippedPigeonAccessories) {
  const accessory = getPigeonAccessoryById(id);

  if (!accessory?.conflictsWith?.length) {
    return false;
  }

  const equippedIds = Object.values(equipped).filter(Boolean);
  return accessory.conflictsWith.some((conflictingId) => equippedIds.includes(conflictingId));
}

import { randomBytes, randomInt } from 'node:crypto';

const PIN_LENGTH = 6;

export function createPin(existingPins: Set<string>, random?: () => number): string {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const pinNumber = random
      ? Math.floor(100000 + random() * 900000)
      : randomInt(100000, 1_000_000);
    const pin = String(pinNumber).slice(0, PIN_LENGTH);

    if (!existingPins.has(pin)) {
      return pin;
    }
  }

  throw new Error('Não foi possível gerar um PIN único.');
}

export function createToken(): string {
  return randomBytes(32).toString('base64url');
}

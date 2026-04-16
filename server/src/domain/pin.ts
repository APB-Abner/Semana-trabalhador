const PIN_LENGTH = 6;

export function createPin(existingPins: Set<string>, random = Math.random): string {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const pin = String(Math.floor(100000 + random() * 900000)).slice(0, PIN_LENGTH);

    if (!existingPins.has(pin)) {
      return pin;
    }
  }

  throw new Error('Não foi possível gerar um PIN único.');
}

export function createToken(random = Math.random): string {
  const randomPart = Math.floor(random() * Number.MAX_SAFE_INTEGER).toString(36);
  return `${Date.now().toString(36)}-${randomPart}`;
}

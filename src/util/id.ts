const BASE32 = 'abcdefghijklmnopqrstuvwxyz234567';

export const randomBase32Id = (length: number): string => {
  const randomCharacter = (): string => {
    const tArray = new Uint8Array(1);
    return BASE32[crypto.getRandomValues(tArray)[0] % BASE32.length];
    // Uncomment the following if needed (non-power of 2):
    /*while (true) {
      const value = crypto.getRandomValues(tArray)[0];
      if (value < size - ((size - BASE32.length) % BASE32.length)) {
        return BASE32[value % BASE32.length];
      }
    }*/
  }
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(randomCharacter());
  }
  return array.join('');
};


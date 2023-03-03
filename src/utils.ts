export function randomHex(length: number = 8) {
  return [...crypto.getRandomValues(new Uint8Array(32))]
    .map((m) => m.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length)
}

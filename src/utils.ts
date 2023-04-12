

export const toHex = (n: number, padding?: number) => {
  const val = n.toString(16).toUpperCase()
  return val.padStart(padding || 0, '0')
}

export const toAscii = (n: number) => n >= 0x20 && n < 0x7f ? String.fromCharCode(n) : '.'

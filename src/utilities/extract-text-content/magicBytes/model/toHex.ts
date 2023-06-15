const hex = (num: number) => Number(num).toString(16).toLowerCase()
export const toHex = (num: number): string =>
  `0x${hex(num).length === 1 ? '0' + hex(num) : hex(num)}`
export const fromHex = (hex: string) => Number(hex)

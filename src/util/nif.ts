export const generateNif = (startWithNum: number | string): string => {
  const randomNum = getRandomNum(8 - startWithNum.toString().length)
  const randomNif = `${startWithNum}${randomNum}`
  const checkDigit = getCheckDigit(randomNif)

  return `${randomNif}${checkDigit}`
}

const getRandomNum = (exp: number): number => {
  return Math.floor(Math.random() * Math.pow(9, exp)) + Math.pow(8, exp)
}

const getCheckDigit = (num: string | number): number => {
  if (!num) return 0

  let sum = 0
  let module11 = 0

  num
    .toString()
    .split('')
    .reverse()
    .forEach((curr, index) => {
      sum += parseInt(curr, 10) * (index + 2)
    })

  module11 = sum % 11

  return module11 < 2 ? 0 : 11 - module11
}

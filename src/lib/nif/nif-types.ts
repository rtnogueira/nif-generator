export interface NifType {
  /** Leading digits that identify the taxpayer category. */
  prefix: string
  label: string
}

export const NIF_TYPES = [
  { prefix: '1', label: 'Pessoa singular' },
  { prefix: '2', label: 'Pessoa singular' },
  { prefix: '3', label: 'Pessoa singular (a partir de julho de 2019)' },
  { prefix: '38', label: 'Pessoa singular' },
  { prefix: '39', label: 'Pessoa singular' },
  { prefix: '45', label: 'Pessoa singular não residente' },
  { prefix: '5', label: 'Pessoa colectiva' },
  { prefix: '6', label: 'Administração pública (Central, Regional ou Local)' },
  { prefix: '71', label: 'Pessoa colectiva não residente' },
  { prefix: '70', label: 'Herança indivisa' },
  { prefix: '74', label: 'Herança indivisa' },
  { prefix: '75', label: 'Herança indivisa' },
  { prefix: '72', label: 'Fundos de investimento' },
  { prefix: '77', label: 'Atribuição oficiosa' },
  { prefix: '78', label: 'Atribuição oficiosa não residentes (processo VAT REFUND)' },
  { prefix: '79', label: 'Regime excepcional' },
  { prefix: '8', label: 'Empresário em nome individual (extinto)' },
  { prefix: '9', label: 'Pessoa colectiva irregular ou número provisório' },
  { prefix: '90', label: 'Condomínios e sociedades irregulares' },
  { prefix: '91', label: 'Condomínios e sociedades irregulares' },
  { prefix: '98', label: 'Não residentes sem estabelecimento estável' },
  { prefix: '99', label: 'Sociedades civis sem personalidade jurídica' },
] as const satisfies readonly NifType[]

export type NifPrefix = (typeof NIF_TYPES)[number]['prefix']

export const DEFAULT_NIF_PREFIX: NifPrefix = '2'

export function isNifPrefix(value: string): value is NifPrefix {
  return NIF_TYPES.some(type => type.prefix === value)
}

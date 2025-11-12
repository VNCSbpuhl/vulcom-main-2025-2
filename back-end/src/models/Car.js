import { z } from 'zod'

// Cores permitidas
const cores = [
  'AMARELO', 'AZUL', 'BRANCO', 'CINZA', 'DOURADO', 'LARANJA', 
  'MARROM', 'PRATA', 'PRETO', 'ROSA', 'ROXO', 'VERDE', 'VERMELHO'
]

// Ano corrente para validação
const currentYear = new Date().getFullYear()

// Data de abertura da loja: 20/03/2020
const storeOpeningDate = new Date('2020-03-20')
storeOpeningDate.setHours(0, 0, 0, 0) // Zera horas, minutos, segundos e milissegundos

// Data de hoje (sem horas)
const today = new Date()
today.setHours(23, 59, 59, 999) // Define para o final do dia

const Car = z.object({
  brand: z.string()
    .trim()
    .min(1, { message: 'A marca deve ter, no mínimo, 1 caractere.' })
    .max(25, { message: 'A marca deve ter, no máximo, 25 caracteres.' }),

  model: z.string()
    .trim()
    .min(1, { message: 'O modelo deve ter, no mínimo, 1 caractere.' })
    .max(25, { message: 'O modelo deve ter, no máximo, 25 caracteres.' }),

  color: z.enum(cores, {
    message: 'A cor deve ser uma das seguintes: AMARELO, AZUL, BRANCO, CINZA, DOURADO, LARANJA, MARROM, PRATA, PRETO, ROSA, ROXO, VERDE, VERMELHO.'
  }),

  year_manufacture: z.coerce.number()
    .int({ message: 'O ano de fabricação deve ser um número inteiro.' })
    .min(1960, { message: 'O ano de fabricação deve ser, no mínimo, 1960.' })
    .max(currentYear, { message: `O ano de fabricação não pode ser posterior a ${currentYear}.` }),

  imported: z.coerce.boolean({
    message: 'O campo importado deve ser verdadeiro ou falso.'
  }),

  plates: z.string()
    .trim()
    .transform(val => val.replace(/[_\s-]/g, '')) // Remove espaços, hífens e sublinhados da máscara
    .refine(val => val.length === 8, {
      message: 'A placa deve ter exatamente 8 caracteres.'
    }),

  selling_date: z.coerce.date()
    .min(storeOpeningDate, {
      message: 'A data de venda não pode ser anterior à data de abertura da loja (20/03/2020).'
    })
    .max(today, {
      message: 'A data de venda não pode ser posterior à data de hoje.'
    })
    .nullish(), // Campo opcional

  selling_price: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? null : val,
    z.coerce.number()
      .min(5000, { message: 'O preço de venda deve ser, no mínimo, R$ 5.000,00.' })
      .max(5000000, { message: 'O preço de venda deve ser, no máximo, R$ 5.000.000,00.' })
      .nullish()
  ) // Campo opcional
})

export default Car


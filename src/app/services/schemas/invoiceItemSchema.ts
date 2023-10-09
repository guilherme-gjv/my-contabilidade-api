import { z } from "zod";

export const invoiceItemSchema = z.object({
  invoiceId: z.number({
    required_error: "O campo 'invoiceId' é obrigatório.",
    description: "O campo 'invoiceId' deve ser um número.",
  }),
  name: z
    .string({
      required_error: "O campo 'name' é obrigatório.",
      description: "O campo 'name' deve ser string.",
    })
    .optional(),
  price: z
    .number({
      required_error: "O campo 'price' é obrigatório.",
      description: "O campo 'price' deve ser um número.",
    })
    .optional(),
});

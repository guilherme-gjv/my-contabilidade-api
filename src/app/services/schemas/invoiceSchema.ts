import { z } from "zod";

export const invoiceSchema = z.object({
  userId: z.number({ description: "O campo 'userId' deve ser um número." }),
  enterpriseCnpj: z
    .string({ description: "O campo 'enterpriseCnpj' deve ser string." })
    .optional(),
  description: z
    .string({ description: "O campo 'description' deve ser string." })
    .optional(),
});

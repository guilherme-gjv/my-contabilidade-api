import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string({
      required_error: "O campo 'email' é obrigatório.",
      description: "O campo 'email' deve ser string.",
    })
    .email({ message: "email inválido." }),
  cpf: z
    .string({ description: "O campo 'cpf' deve ser string." })
    .min(11, { message: "O cpf ou cpnj deve possuir 11 ou 14 dígitos." })
    .max(14, { message: "O cpf ou cpnj deve possuir 11 ou 14 dígitos." })
    .optional(),
  name: z
    .string({
      required_error: "O campo 'name' é obrigatório",
      description: "O campo 'name' deve ser string.",
    })
    .min(4, { message: "O nome deve ter pelo menos 4 caracteres." }),
  password: z
    .string({
      required_error: "O campo 'password' é obrigatório.",
      description: "O campo 'email' deve ser string.",
    })
    .min(8, { message: "A senha deve possuir ao menos 8 caracteres." }),
});

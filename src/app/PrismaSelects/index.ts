import { Prisma } from "@prisma/client";

export const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  cpf: true,
  name: true,
  password: false,
  createdAt: true,
  updatedAt: true,
};

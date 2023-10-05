import { Prisma } from "@prisma/client";

export const authSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  cpf: false,
  name: false,
  password: true,
  createdAt: false,
  updatedAt: false,
};

export const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  cpf: true,
  name: true,
  password: false,
  createdAt: true,
  updatedAt: true,
};

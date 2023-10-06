import { Prisma } from "@prisma/client";

export const authSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  cpf: true,
  name: true,
  password: true,
  createdAt: true,
  updatedAt: true,
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

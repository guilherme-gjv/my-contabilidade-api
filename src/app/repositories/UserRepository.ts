import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { userSelect } from "../PrismaSelects";
import { IUser } from "../domain/models/IUser";

const prisma = new PrismaClient();

const createUser = async ({ email, cpf, name, password }: IUser) => {
  const hashedPassword = await bcrypt.hash(password, 8);

  const createdUser = await prisma.user.create({
    data: {
      email,
      name,
      cpf,
      password: hashedPassword,
    },
    select: userSelect,
  });

  return createdUser;
};

const findAll = async (
  page: number | undefined = 1,
  rows: number | undefined = 10
) => {
  if (page < 1) {
    page = 1;
  }

  if (rows < 1) {
    rows = 1;
  }

  if (rows > 50) {
    rows = 50;
  }

  const [count, users] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.findMany({
      skip: (page - 1) * rows,
      take: rows,
      select: userSelect,
    }),
  ]);

  return { users, rows, page, count };
};

const findById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  return user;
};

const updateById = async (
  { email, cpf, name, password }: IUser,
  id: number
) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { email, cpf, name, password },
    select: userSelect,
  });

  return updatedUser;
};

const deleteById = async (id: number) => {
  const deletedUser = await prisma.user.delete({
    where: { id },
    select: userSelect,
  });

  return deletedUser;
};

export default {
  createUser,
  findAll,
  findById,
  updateById,
  deleteById,
};

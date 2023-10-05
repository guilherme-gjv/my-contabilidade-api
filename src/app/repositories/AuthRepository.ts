import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { authSelect } from "../PrismaSelects";

const prisma = new PrismaClient();

const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: authSelect,
  });

  if (user && user.password) {
    const result = await bcrypt.compare(password, user.password);

    return { authorized: result, data: user };
  }

  return { authorized: false, data: undefined };
};

export default { login };

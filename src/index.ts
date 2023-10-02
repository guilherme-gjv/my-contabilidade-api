import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();

app.use(express.json());

const prisma = new PrismaClient();

app.get("/test", async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        cpf: "11199933366",
        email: "maria@email.com",
        name: "Maria da Silva",
        password: "12345678",
      },
    });

    const allUsers = await prisma.user.findMany();

    return res.status(200).json({ reqData: newUser, data: allUsers });
  } catch (error) {
    console.log("error: ");

    console.log(error);
    return res.status(500).json({ error: "Erro" });
  }
});

app.listen(8080, () => {
  console.log("Server running at 8080");
});

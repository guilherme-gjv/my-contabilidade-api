import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;

export const config = {
  server: {
    port: PORT,
  },
};

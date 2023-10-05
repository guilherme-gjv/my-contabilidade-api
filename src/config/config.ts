import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "";

export const config = {
  server: {
    port: PORT,
  },
  jwt_secret: JWT_SECRET,
};

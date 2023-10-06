import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "";
const APP_STATE = process.env.APP_STATE || "PROD";

export const config = {
  server: {
    port: PORT,
  },
  jwt_secret: JWT_SECRET,
  app: {
    state: APP_STATE,
  },
};

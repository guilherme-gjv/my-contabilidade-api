import express, { Request } from "express";
import router from "./app/routes";
import cors from "cors";
import { config } from "./config/config";

const app = express();

app.use(express.json());
app.use(cors<Request>());

app.use("/v1", router);

app.listen(config.server.port, () => {
  console.log("Server running at " + config.server.port);
});

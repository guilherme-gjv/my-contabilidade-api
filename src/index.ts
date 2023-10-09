import express, { Request } from "express";
import router from "./app/routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors<Request>());

app.use("/v1", router);

app.listen(8080, () => {
  console.log("Server running at 8080");
});

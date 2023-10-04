import express from "express";
import router from "./app/routes";

const app = express();

app.use(express.json());

app.use("/v1", router);

app.listen(8080, () => {
  console.log("Server running at 8080");
});

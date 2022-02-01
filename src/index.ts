import express from "express";
import morgan from "morgan";
import "dotenv/config";
import Router from "./routes";
import cors from "cors";
import { IBaseItems } from "./models/Commons";
const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(process.env.API_VERSSION, Router);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Running on port http://localhost:${process.env.PORT || 5000}`);
});
